import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './service/in-memory-data.service';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './module/app-routing.module';

import {DemoComponent} from './component/demo.component';
import {Demo2Component} from './component/demo2.component';

import {ResultData} from './service/resultData.service';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    Demo2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  providers: [ResultData],
  bootstrap: [AppComponent]
})
export class AppModule { }
