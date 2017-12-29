import {Component, ElementRef, OnInit} from '@angular/core';
import {UserBean} from '../../bean/user.bean';
import {HttpRequestService} from '../../service/http-request.service';
import {ResponseBean} from '../../bean/response.bean';
import {GlobalService} from '../../../../service/global.service';
import {NzMessageService} from 'ng-zorro-antd';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public registerUser = new UserBean();
  public loginUser = new UserBean();

  constructor(private elementRef: ElementRef, private httpRequestService: HttpRequestService, private globalService: GlobalService, private nzMessageService: NzMessageService) {
  }

  ngOnInit() {
  }


  cambiarLogin() {
    this.elementRef.nativeElement.querySelector('.cont_forms').className = 'cont_forms cont_forms_active_login';
    this.elementRef.nativeElement.querySelector('.cont_form_login').style.display = `block`;
    this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.opacity = `0`;

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.cont_form_login').style.opacity = '1';
    }, 400);

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.display = 'none';
    }, 200);
  }


  cambiarSignUp() {
    this.elementRef.nativeElement.querySelector('.cont_forms').className = 'cont_forms cont_forms_active_sign_up';
    this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.display = 'block';
    this.elementRef.nativeElement.querySelector('.cont_form_login').style.opacity = '0';

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.opacity = '1';
    }, 100);

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.cont_form_login').style.display = 'none';
    }, 400);

  }

  ocultarLoginSignUp() {
    this.elementRef.nativeElement.querySelector('.cont_forms').className = 'cont_forms';
    this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.opacity = '0';
    this.elementRef.nativeElement.querySelector('.cont_form_login').style.opacity = '0';

    setTimeout(function () {
      this.elementRef.nativeElement.querySelector('.cont_form_sign_up').style.display = 'none';
      this.elementRef.nativeElement.querySelector('.cont_form_login').style.display = 'none';
    }, 500);

  }

  /**
   * 注册
   */
  public signUp() {
    // 校验
    if (!this.registerUser) {
      this.nzMessageService.error(`请输入信息`);
      return;
    }
    if (!this.registerUser.username) {
      this.nzMessageService.error(`请输入用户名`);
      return;
    }
    if (!this.registerUser.nickname) {
      this.nzMessageService.error(`请输入昵称`);
      return;
    }
    if (!this.registerUser.password) {
      this.nzMessageService.error(`请输入密码`);
      return;
    }
    if (this.registerUser.password !== this.registerUser.confirmPassword) {
      this.nzMessageService.error(`两次密码不一致`);
      return;
    }
    this.httpRequestService.signUpRequest(this.registerUser).then((r: ResponseBean) => {
      this.responseDeal(r);
    });
  }

  /**
   * 登录
   */
  public login() {
    if (!this.loginUser) {
      this.nzMessageService.error(`请输入信息`);
      return;
    }
    if (!this.loginUser.username) {
      this.nzMessageService.error(`请输入用户名`);
      return;
    }
    if (!this.loginUser.password) {
      this.nzMessageService.error(`请输入密码`);
      return;
    }
    this.httpRequestService.loginRequest(this.loginUser).then((r: ResponseBean) => {
      this.responseDeal(r);
    });
  }

  private responseDeal(r: ResponseBean) {
    if (r.success) {
      this.globalService.user = r.data;
      this.nzMessageService.success(`${ this.globalService.user.nickname},你${r.msg}`);
    } else {
      this.nzMessageService.error(r.msg);
    }

  }
}
