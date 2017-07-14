/**
 * Created by soddygosongguochao on 2017/6/1.
 */
import {Line} from './Line';
import {Node} from './Node';

/**
 * 同时包含节点和线的数据对象
 */
export class DataResult {
  node: any[];
  line: any[];

  constructor(node: any[], line: any[]) {
    this.node = node;
    this.line = line;
  }
}
