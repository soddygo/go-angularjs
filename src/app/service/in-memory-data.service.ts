/**
 * Created by soddygosongguochao on 2017/5/31.
 */

import {InMemoryDbService} from 'angular-in-memory-web-api';
import {DataResult} from '../pojo/DataResult';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const nodes = [
      {key: 1, name: '标题', text: 'one', color: 'lightyellow', picture: '../../assets/img/1.png'},
      {key: 2, name: '标题', text: 'two', color: 'brown', picture: '../../assets/img/1.png'},
      {key: 3, name: '标题', text: 'three', color: 'green', picture: '../../assets/img/1.png'},
      {key: 4, name: '标题', text: 'four', color: 'slateblue', picture: '../../assets/img/1.png'},
      {key: 5, name: '标题', text: 'five', color: 'aquamarine', picture: '../../assets/img/1.png'},
      {key: 6, name: '标题', text: 'six', color: 'lightgreen', picture: '../../assets/img/1.png'},
      {key: 7, name: '标题', text: 'seven'}
    ];
    const lines = [
      {from: 5, to: 6, color: 'orange'},
      {from: 1, to: 2, color: 'red'},
      {from: 1, to: 3, color: 'blue'},
      {from: 1, to: 4, color: 'goldenrod'},
      {from: 2, to: 5, color: 'fuchsia'},
      {from: 3, to: 5, color: 'green'},
      {from: 4, to: 5, color: 'black'},
      {from: 6, to: 7}
    ];
    const result: DataResult = new DataResult(nodes, lines);
    return {'nodes': nodes, 'lines': lines, 'result': result};
  }
}
