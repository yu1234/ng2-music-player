import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {AJAX, DefaultArgs} from '../../../global-data';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {UserBean} from '../bean/user.bean';
import {ResponseBean} from '../bean/response.bean';
import {GlobalService} from '../../../service/global.service';

@Injectable()
export class HttpRequestService {

  constructor(private http: HttpClient, private globalService: GlobalService) {
  }

  /**
   * 注册请求
   * @param {UserBean} user
   * @returns {Promise<UserBean>}
   */
  public signUpRequest(user: UserBean): Promise<ResponseBean> {
    const url = `http://${this.globalService.SERVER.IP}:${this.globalService.SERVER.PORT}/sys/public/api/register`;
    return this.http.post(url, user).toPromise().then(response => response as ResponseBean).catch(this.handleError);
  }

  /**
   * 登陆请求
   * @param {UserBean} user
   * @returns {Promise<UserBean>}
   */
  public loginRequest(user: UserBean): Promise<ResponseBean> {
    const url = `http://${this.globalService.SERVER.IP}:${this.globalService.SERVER.PORT}/sys/public/api/login`;
    return this.http.post(url, user).toPromise().then(response => response as ResponseBean).catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse): Promise<any> {
    console.error(error);
    return Promise.reject(error.message || error);
  }
}
