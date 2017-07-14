/**
 * Created by soddygosongguochao on 2017/6/1.
 */
import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {DataResult} from '../pojo/DataResult';
import {Line} from '../pojo/Line';
import {Node} from '../pojo/Node';

@Injectable()
export class ResultData {
  private headers = new Headers({'Content-Type': 'application/json'});
  private demoNodeUrl = 'api/nodes';  // URL to web api
  private demoLinkUrl = 'api/lines';  // URL to web api

  constructor(private http: Http) {
  }

  // 查询demo 的json数据
  getDemoNodeResult(): Promise<Node[]> {
    return this.http.get(this.demoNodeUrl, JSON.stringify({})).toPromise()
      .then(response => response.json().data as Node[]).catch(this.handleError);
  }

  // 查询demo 的json数据
  getDemoLineResult(): Promise<Line[]> {
    return this.http.get(this.demoLinkUrl, JSON.stringify({})).toPromise()
      .then(response => response.json().data as Line[]).catch(this.handleError);
  }

  // 同时获取node和line
  getDemoResult(): Promise<DataResult> {
    const url = 'api/result';
    return this.http.get(url, JSON.stringify({})).toPromise()
      .then(response => response.json().data as DataResult).catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
