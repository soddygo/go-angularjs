/**
 * Created by soddygosongguochao on 2017/5/31.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DemoComponent} from '../component/demo.component';
import {Demo2Component} from '../component/demo2.component';


// 静态路由器
const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard',  component: null },
  // { path: 'detail/:id', component: null },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: 'demo', component: DemoComponent},
  {path: 'demo2', component: Demo2Component}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
