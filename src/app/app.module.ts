import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import {AuthenticationModule} from './modules/authentication/authentication.module';
import {AuthenticationRoutingModule} from './modules/authentication/authentication-routing.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {GlobalService} from './service/global.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent],
  entryComponents: [],
  schemas: []
})
export class AppModule {
}
