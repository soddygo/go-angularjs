"use strict";
/**
 * Created by soddygosongguochao on 2017/5/31.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var go = require("gojs");
require("rxjs/add/operator/toPromise");
// import {Inspector} from '../../assets/js/base/DataInspector.js';
var myDiagram = {};
var DemoComponent = (function () {
    function DemoComponent(resultData) {
        this.resultData = resultData;
        this.hearder = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.url = 'api/demo';
    }
    DemoComponent.prototype.ngOnInit = function () {
        var title = 'app works!';
        // init dataJson
        this.dataJson = {
            'class': 'go.GraphLinksModel',
            'nodeDataArray': [
                { key: 1, name: '小企业移动办公', text: 'one', color: 'lightyellow', picture: '/assets/img/1.png' },
                { key: 2, name: '信贷', text: 'two', color: 'brown', picture: '/assets/img/1.png' },
                { key: 3, name: 'ECIF', text: 'three', color: 'green', picture: '/assets/img/1.png' },
                { key: 4, name: '互联网统一支付平台', text: 'four', color: 'slateblue', picture: '/assets/img/1.png' },
                { key: 5, name: '电子验印', text: 'five', color: 'aquamarine', picture: '/assets/img/1.png' },
                { key: 6, name: '集中作业', text: 'six', color: 'lightgreen', picture: '/assets/img/1.png' },
                { key: 7, name: '总账', text: 'seven', picture: '/assets/img/1.png' }
            ],
            'linkDataArray': [
                { from: 5, to: 6, color: 'orange' },
                { from: 1, to: 2, color: 'red' },
                { from: 1, to: 3, color: 'blue' },
                { from: 1, to: 4, color: 'goldenrod' },
                { from: 2, to: 5, color: 'fuchsia' },
                { from: 3, to: 5, color: 'green' },
                { from: 4, to: 5, color: 'black' },
                { from: 6, to: 7 }
            ]
        };
        // init demo
        this.initDemo();
    };
    /**
     * 获取数据,并初始化demo
     */
    DemoComponent.prototype.initDemo = function () {
        // this.resultData.getDemoResult().then(data => {
        //   this.resultNode = data.node;
        //   this.resultLine = data.line;
        //   gojsDemo(this.resultNode, this.resultLine);
        // });
        this.resultNode = this.dataJson['nodeDataArray'];
        this.resultLine = this.dataJson['linkDataArray'];
        // this.load(); // 重新加载myDiagram.Model数据
        gojsDemo(this.resultNode, this.resultLine);
    };
    /**
     * 错误处理
     * @param error
     * @returns {Promise<never>}
     */
    DemoComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    // Show the diagram's model in JSON format
    DemoComponent.prototype.save = function () {
        this.dataJson = myDiagram.model.toJson();
        myDiagram.isModified = false;
    };
    // load data json 从页面html里加载json数据
    DemoComponent.prototype.load = function () {
        myDiagram.model = go.Model.fromJson(document.getElementById('mySavedModel').nodeValue);
        // myDiagram.model = go.Model.fromJson(this.dataJson.valueOf());
    };
    // This is the general menu command handler, parameterized by the name of the command.
    DemoComponent.prototype.cxcommand = function (event, val) {
        if (val === undefined) {
            val = event.currentTarget.id;
        }
        var diagram = myDiagram;
        switch (val) {
            case 'cut':
                diagram.commandHandler.cutSelection();
                break;
            case 'copy':
                diagram.commandHandler.copySelection();
                break;
            case 'paste':
                diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint);
                break;
            case 'delete':
                diagram.commandHandler.deleteSelection();
                break;
            case 'color': {
                var color = window.getComputedStyle(document.elementFromPoint(event.clientX, event.clientY).parentElement)['background-color'];
                this.changeColor(diagram, color);
                break;
            }
        }
        diagram.currentTool.stopTool();
    };
    // A custom command, for changing the color of the selected node(s).
    DemoComponent.prototype.changeColor = function (diagram, color) {
        // Always make changes in a transaction, except when initializing the diagram.
        diagram.startTransaction('change color');
        diagram.selection.each(function (node) {
            if (node instanceof go.Node) {
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                diagram.model.setDataProperty(data, 'color', color);
            }
        });
        diagram.commitTransaction('change color');
    };
    return DemoComponent;
}());
DemoComponent = __decorate([
    core_1.Component({
        selector: 'demo',
        templateUrl: '../../assets/html/demo.html',
        styleUrls: ['../../assets/css/contextMenu.css']
    })
], DemoComponent);
exports.DemoComponent = DemoComponent;
//
// /**
//  * 重写link的方法
//  */
// class MultiArrowLink extends go.Link {
//   constructor() {
//     super();
//     this.routing = go.Link.Orthogonal;
//   }
//
//   makeGeometry() {
//     const geo = super.makeGeometry();
//     if (geo.type !== go.Geometry.Path || geo.figures.length === 0) {
//       return geo;
//     }
//     const mainfig = geo.figures.elt(0);  // assume there's just one PathFigure
//     const mainsegs = mainfig.segments;
//
//     const arrowLen = 8;  // length for each arrowhead
//     const arrowWid = 3;  // actually half-width of each arrowhead
//     let fx = mainfig.startX;
//     let fy = mainfig.startY;
//     for (let i = 0; i < mainsegs.length; i++) {
//       const a = mainsegs.elt(i);
//       // assume each arrowhead is a simple triangle
//       const ax = a.endX;
//       const ay = a.endY;
//       let bx = ax;
//       let by = ay;
//       let cx = ax;
//       let cy = ay;
//       if (fx < ax - arrowLen) {
//         bx -= arrowLen;
//         by += arrowWid;
//         cx -= arrowLen;
//         cy -= arrowWid;
//       } else if (fx > ax + arrowLen) {
//         bx += arrowLen;
//         by += arrowWid;
//         cx += arrowLen;
//         cy -= arrowWid;
//       } else if (fy < ay - arrowLen) {
//         bx -= arrowWid;
//         by -= arrowLen;
//         cx += arrowWid;
//         cy -= arrowLen;
//       } else if (fy > ay + arrowLen) {
//         bx -= arrowWid;
//         by += arrowLen;
//         cx += arrowWid;
//         cy += arrowLen;
//       }
//       geo.add(new go.PathFigure(ax, ay, true)
//         .add(new go.PathSegment(go.PathSegment.Line, bx, by))
//         .add(new go.PathSegment(go.PathSegment.Line, cx, cy).close()));
//       fx = ax;
//       fy = ay;
//     }
//     return geo;
//   }
// }
/**
 * 核心
 * gojs demo函数
 */
function gojsDemo(nodes, lines) {
    var $ = go.GraphObject.make;
    // This is the actual HTML context menu:
    var cxElement = document.getElementById('contextMenu');
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    var myContextMenu = $(go.HTMLInfo, {
        show: showContextMenu,
        mainElement: cxElement
    });
    myDiagram =
        $(go.Diagram, 'myDiagramDiv', // the ID of the DIV HTML element
        {
            initialContentAlignment: go.Spot.Center,
            layout: $(go.ForceDirectedLayout),
            'undoManager.isEnabled': true
        });
    myDiagram.nodeTemplate =
        $(go.Node, go.Panel.Auto, {
            contextMenu: myContextMenu
        }, 
        // {locationSpot: go.Spot.Center},
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Picture, { name: 'Picture', desiredSize: new go.Size(140, 50), margin: 1 }, new go.Binding('source', 'picture', function (picture) {
            return picture;
        }).makeTwoWay()), $(go.Panel, 'Vertical', $(go.TextBlock, {
            margin: 10,
            editable: true,
            font: 'bold 12pt sans-serif'
        }, new go.Binding('font', 'name', function (name) {
            var font = 'bold 12pt sans-serif';
            // 根据name长度，控制字体大小
            if (name.length > 6) {
                var size = 12 - (name.length - 6);
                if (size <= 0) {
                    font = 'bold 1pt sans-serif';
                }
                else {
                    font = 'bold ' + size + 'pt sans-serif';
                }
            }
            return font;
        }), new go.Binding('text', 'name'))
        // ,
        // $(go.TextBlock,
        //   {margin: 10, font: 'bold 12pt sans-serif'},
        //   new go.Binding('text', 'text'))
        ));
    myDiagram.linkTemplate =
        // $(MultiArrowLink,  // subclass of Link, defined below
        $(go.Link, // subclass of Link, defined below
        { routing: go.Link.AvoidsNodes, corner: 5 }, $(go.Shape, { isPanelMain: true, toArrow: 'OpenTriangle' }, new go.Binding('fill', 'color')), 
        // no arrowhead is defined here -- they are hard-coded in MultiArrowLink.makeGeometry
        $(go.Shape, { stroke: 'black', fill: 'black', toArrow: 'Standard' }));
    // angularjs http请求数据
    // create a few nodes and links
    console.log('nodes:' + JSON.stringify(nodes));
    console.log('lines:' + JSON.stringify(lines));
    myDiagram.model = new go.GraphLinksModel(nodes, lines);
    // ----------------
    function showContextMenu(obj, diagram, tool) {
        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;
        document.getElementById('cut').style.display = cmd.canCutSelection() ? 'block' : 'none';
        document.getElementById('copy').style.display = cmd.canCopySelection() ? 'block' : 'none';
        document.getElementById('paste').style.display = cmd.canPasteSelection() ? 'block' : 'none';
        document.getElementById('delete').style.display = cmd.canDeleteSelection() ? 'block' : 'none';
        document.getElementById('color').style.display = (obj !== null ? 'block' : 'none');
        // Now show the whole context menu element
        cxElement.style.display = 'block';
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 'px';
        cxElement.style.top = mousePt.y + 'px';
    }
    myDiagram.contextMenu = myContextMenu;
    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener('contextMenu', function (e) {
        console.log('test:contextMenu');
        e.preventDefault();
        return false;
    }, false);
}
