/**
 * gojs demo
 * Created by soddygosongguochao on 2017/3/13.
 */

var gojsApp = angular.module("gojsApp", []);

//**http设置*//
gojsApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // OvApperride $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);

gojsApp.controller("gojsCtrl", gojsCtrl)

//controller
var myDiagram = null;//图形对象
var cxElement = null;//右键菜单

function gojsCtrl($compile, $scope, $http, $q) {

    var $ = null;//gojs 全局对象
    $scope.layout = "TreeLayout";
    $scope.nodeColor = "blue";

    $scope.nodeData = null;//点击的节点数据对象
    $scope.nodeDataShow = false;//点击的节点数据对象
    $scope.menuText = null;//菜单点击提示信息演示


    /**
     * gojs init
     */
    $scope.init = function () {
        console.log("init active!");
        $ = go.GraphObject.make;  // for conciseness in defining templates
        $scope.firstInit();//gojs init


    }


    /**
     * 更改布局
     */
    $scope.changeLayout = function () {
        myDiagram.startTransaction("change Layout");
        var layout = $(go.TreeLayout);
        switch ($scope.layout) {
            case "ForceDirectedLayout":
                layout = $(go.ForceDirectedLayout);
                break;
            case "LayeredDigraphLayout":
                layout = $(go.LayeredDigraphLayout);
                break;
            case "TreeLayout":
                layout = $(go.TreeLayout);
                break;
            case "CircularLayout":
                layout = $(go.CircularLayout);
                break;
            case "GridLayout":
                layout = $(go.GridLayout);
                break;
        }
        myDiagram.layout = layout;
        myDiagram.commitTransaction("change Layout");
    }

    /**
     * 获取节点和链接线的json数据
     * @returns {Promise}
     */
    $scope.queryDemoJson = function () {
        var deferred = $q.defer();
        var dataPromise = deferred.promise;

        $http({
            url: "../json/demo.json",
            method: "GET",
            data: {}
        }).then(function (resp) {
            var data = resp.data;
            deferred.resolve(data);

        });
        return dataPromise;
    }


    /**
     * 图形初始化
     */
    $scope.firstInit = function () {

        var $ = go.GraphObject.make;  // for conciseness in defining templates

        myDiagram =
            $(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
                {initialContentAlignment: go.Spot.Center, "undoManager.isEnabled": true});

        // This is the actual HTML context menu:
        cxElement = document.getElementById("contextMenu");

        // Since we have only one main element, we don't have to declare a hide method,
        // we can set mainElement and GoJS will hide it automatically
        var myContextMenu = $(go.HTMLInfo, {
            show: showContextMenu,
            mainElement: cxElement
        });

        // define a simple Node template (but use the default Link template)
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                {
                    contextMenu: myContextMenu
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Rectangle",
                    {
                        stroke: null, strokeWidth: 0,
                        fill: "transparent", // the default fill, if there is no data-binding
                        portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
                        // allow all kinds of links from and to this port
                        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                    }),
                $(go.Panel, "Vertical",

                    $(go.Picture, {name: 'Picture', desiredSize: new go.Size(40, 48), margin: 1},
                        new go.Binding("source", "type", pictureHandle).makeTwoWay()),
                    $(go.TextBlock,
                        {
                            margin: 3,
                            editable: true,
                            stroke: 'white',
                            font: "bold 10pt helvetica, bold arial, sans-serif"
                        },  // some room around the text
                        // TextBlock.text is bound to Node.data.key
                        new go.Binding("text", "name").makeTwoWay())
                )
            )
        ;


        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                // path animation works with these kinds of links too:
                {relinkableFrom: true, relinkableTo: true},
                //{ curve: go.Link.Bezier },
                $(go.Shape,  // the link shape
                    {stroke: "black"})
            );

        /**
         * 增加线上游走的效果的配置信息
         */
        myDiagram.nodeTemplateMap.add("token",
            $(go.Part,
                {
                    locationSpot: go.Spot.Center, layerName: "Foreground"
                },
                $(go.Shape, "Circle",
                    {width: 12, height: 12, fill: "green", strokeWidth: 0},
                    new go.Binding("fill", "color"))
            ));


        myDiagram.contextMenu = myContextMenu;

        // We don't want the div acting as a context menu to have a (browser) context menu!
        cxElement.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        }, false);

        //数据获取
        var jsonPromise = $scope.queryDemoJson();

        $q.all([jsonPromise]).then(function (result) {
            var nodeDataArray = result[0];


            console.log("nodeDataArray:" + JSON.stringify(nodeDataArray));
            myDiagram.model = go.Model.fromJson(nodeDataArray);

            document.getElementById("mySavedModel").value = myDiagram.model.toJson();//保存到html里

            // read in the JSON-format data from the "mySavedModel" element
            // load(myDiagram.model, nodeDataArray, linkDataArray);
            initTokens();

            // select a Node, so that the first Inspector shows something
            myDiagram.select(myDiagram.nodes.first());
            // Always show the first Node:
            var inspector2 = new Inspector('myInspectorDiv2', myDiagram,
                {
                    // by default the inspector works on the Diagram selection
                    // this lets us inspect our own object using Inspector.inspectObject(object)
                    inspectSelection: false,
                    properties: {
                        "text": {},
                        // This property we want to declare as a color, to show a color-picker:
                        "color": {type: 'color'},
                        // key would be automatically added for node data, but we want to declare it read-only also:
                        "key": {readOnly: true, show: Inspector.showIfPresent}
                    }
                });
            // If not inspecting a selection, you can programatically decide what to inspect (a Part, or a JavaScript object)
            inspector2.inspectObject(myDiagram.nodes.first().data);


            // properties declare which properties to show and how.
            // By default, all properties on the model data objects are shown unless the inspector option "includesOwnProperties" is set to false.

            // Show the primary selection's data, or blanks if no Part is selected:
            var inspector = new Inspector('myInspectorDiv', myDiagram,
                {
                    // uncomment this line to only inspect the named properties below instead of all properties on each object:
                    // includesOwnProperties: false,
                    properties: {
                        "text": {},
                        // key would be automatically added for nodes, but we want to declare it read-only also:
                        "key": {readOnly: true, show: Inspector.showIfPresent},
                        // color would be automatically added for nodes, but we want to declare it a color also:
                        "color": {show: Inspector.showIfPresent, type: 'color'},
                        // Comments and LinkComments are not in any node or link data (yet), so we add them here:
                        "Comments": {show: Inspector.showIfNode},
                        "flag": {show: Inspector.showIfNode, type: 'boolean', defaultValue: true},
                        "LinkComments": {show: Inspector.showIfLink},
                    }
                });

        });


        // Always show the model.modelData:
        var inspector3 = new Inspector('myInspectorDiv3', myDiagram,
            {
                inspectSelection: false
            });
        inspector3.inspectObject(myDiagram.model.modelData);


    }


    //token在链接线上游走
    function initTokens() {
        var oldskips = myDiagram.skipsUndoManager;
        myDiagram.skipsUndoManager = true;
        myDiagram.model.addNodeDataCollection([
            {category: "token", at: 1, color: "green"},
            {category: "token", at: 2, color: "blue"},
            {category: "token", at: 4, color: "yellow"},
            {category: "token", at: 5, color: "purple"},
            {category: "token", at: 7, color: "red"},
            {category: "token", at: 8, color: "black"},
            {category: "token", at: 9, color: "green"},
            {category: "token", at: 11, color: "blue"},
            {category: "token", at: 12, color: "yellow"},
            {category: "token", at: 17, color: "purple"},
            {category: "token", at: 18, color: "red"}
        ]);
        myDiagram.skipsUndoManager = oldskips;
        window.requestAnimationFrame(updateTokens);
    }

    function updateTokens() {
        var oldskips = myDiagram.skipsUndoManager;
        myDiagram.skipsUndoManager = true;
        var temp = new go.Point();
        myDiagram.parts.each(function (token) {
            var data = token.data;
            var at = data.at;
            if (at === undefined) return;
            var from = myDiagram.findNodeForKey(at);
            if (from === null) return;
            var frac = data.frac;
            if (frac === undefined) frac = 0.0;
            var next = data.next;
            var to = myDiagram.findNodeForKey(next);
            if (to === null) {  // nowhere to go?
                positionTokenAtNode(token, from);  // temporarily stay at the current node
                data.next = chooseDestination(token, from);  // and decide where to go next
            } else {  // proceed toward the
                var link = from.findLinksTo(to).first();
                if (link !== null) {
                    var pt = link.path.geometry.getPointAlongPath(frac, temp);
                    pt.x += link.routeBounds.x;
                    pt.y += link.routeBounds.y;
                    token.location = pt;
                } else {  // stay at the current node
                    positionTokenAtNode(token, from);
                }
                if (frac >= 1.0) {  // if beyond the end, it's "AT" the NEXT node
                    data.frac = 0.0;
                    data.at = next;
                    data.next = undefined;  // don't know where to go next
                } else {  // otherwise, move fractionally closer to the NEXT node
                    data.frac = frac + 0.01;
                }
            }
        });
        myDiagram.skipsUndoManager = oldskips;
        window.requestAnimationFrame(updateTokens);
    }

// determine where to position a token when it is resting at a node
    function positionTokenAtNode(token, node) {
        // these details depend on the node template
        token.location = node.position.copy().offset(4 + 6, 5 + 6);
    }

    function chooseDestination(token, node) {
        var dests = new go.List().addAll(node.findNodesOutOf());
        if (dests.count > 0) {
            var dest = dests.elt(Math.floor(Math.random() * dests.count));
            return dest.data.key;
        }
        var arr = myDiagram.model.nodeDataArray;
        // choose a random next data object that is not a token and is not the current Node
        var data = null;
        while (data = arr[Math.floor(Math.random() * arr.length)],
        data.category === "token" || data === node.data) {
        }
        return data.key;
    }


}

// Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

function load() {

    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    // make sure all data have up-to-date "members" collections
    // this does not prevent any "cycles" of membership, which would result in undefined behavior
    var arr = myDiagram.model.nodeDataArray;
    for (var i = 0; i < arr.length; i++) {
        var data = arr[i];
        var supers = data.supers;
        if (supers) {
            for (var j = 0; j < supers.length; j++) {
                var sdata = myDiagram.model.findNodeDataForKey(supers[j]);
                if (sdata) {
                    // update _supers to be an Array of references to node data
                    if (!data._supers) {
                        data._supers = [sdata];
                    } else {
                        data._supers.push(sdata);
                    }
                    // update _members to be an Array of references to node data
                    if (!sdata._members) {
                        sdata._members = [data];
                    } else {
                        sdata._members.push(data);
                    }
                }
            }
        }
    }

    initTokens();
}

//----------------
function showContextMenu(obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
    var cmd = diagram.commandHandler;
    document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
    document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
    document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
    document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";
    document.getElementById("color").style.display = (obj !== null ? "block" : "none");

    // Now show the whole context menu element
    cxElement.style.display = "block";
    // we don't bother overriding positionContextMenu, we just do it here:
    var mousePt = diagram.lastInput.viewPoint;
    cxElement.style.left = mousePt.x + "px";
    cxElement.style.top = mousePt.y + "px";
}


// This is the general menu command handler, parameterized by the name of the command.
function cxcommand(event, val) {
    if (val === undefined) val = event.currentTarget.id;
    var diagram = myDiagram;
    switch (val) {
        case "cut":
            diagram.commandHandler.cutSelection();
            break;
        case "copy":
            diagram.commandHandler.copySelection();
            break;
        case "paste":
            diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint);
            break;
        case "delete":
            diagram.commandHandler.deleteSelection();
            break;
        case "color": {
            var color = window.getComputedStyle(document.elementFromPoint(event.clientX, event.clientY).parentElement)['background-color'];
            changeColor(diagram, color);
            break;
        }
    }
    diagram.currentTool.stopTool();
}

// A custom command, for changing the color of the selected node(s).
function changeColor(diagram, color) {
    // Always make changes in a transaction, except when initializing the diagram.
    diagram.startTransaction("change color");
    diagram.selection.each(function (node) {
        if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
            // Examine and modify the data, not the Node directly.
            var data = node.data;
            // Call setDataProperty to support undo/redo as well as
            // automatically evaluating any relevant bindings.
            diagram.model.setDataProperty(data, "color", color);
        }
    });
    diagram.commitTransaction("change color");
}


/**
 * 节点图片处理
 * @returns {string}
 */
function pictureHandle(type) {

    var src = "../static/img/icon_test.png";

    switch (type) {
        case "1":
            src = "../img/firewall.png"
            break;
        case "2" :
            src = "../img/firewall.png"
            break;
        case "3":
            src = "../img/pc.png"
            break;
    }
    return src;
}


