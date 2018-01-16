"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
/**
 * Created by soddygosongguochao on 2017/6/1.
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var ResultData = (function () {
    function ResultData(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.demoNodeUrl = 'api/nodes'; // URL to web api
        this.demoLinkUrl = 'api/lines'; // URL to web api
    }
    // 查询demo 的json数据
    ResultData.prototype.getDemoNodeResult = function () {
        return this.http.get(this.demoNodeUrl, JSON.stringify({})).toPromise()
            .then(function (response) { return response.json().data; })["catch"](this.handleError);
    };
    // 查询demo 的json数据
    ResultData.prototype.getDemoLineResult = function () {
        return this.http.get(this.demoLinkUrl, JSON.stringify({})).toPromise()
            .then(function (response) { return response.json().data; })["catch"](this.handleError);
    };
    // 同时获取node和line
    ResultData.prototype.getDemoResult = function () {
        var url = 'api/result';
        return this.http.get(url, JSON.stringify({})).toPromise()
            .then(function (response) { return response.json().data; })["catch"](this.handleError);
    };
    ResultData.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return ResultData;
}());
ResultData = __decorate([
    core_1.Injectable()
], ResultData);
exports.ResultData = ResultData;
