import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AuthenticationRoutingModule} from './authentication-routing.module';

import {AuthenticationComponent} from './authentication.component';
import {LoginComponent} from './component/login/login.component';


import {HttpRequestService} from './service/http-request.service';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, AuthenticationRoutingModule],
  declarations: [AuthenticationComponent, LoginComponent],
  exports: [],
  providers: [HttpRequestService]
})
export class AuthenticationModule {
}
