import {Injectable} from '@angular/core';
import {UserBean} from '../modules/authentication/bean/user.bean';

@Injectable()
export class GlobalService {

  private _user: UserBean;

  public readonly SERVER = {
    IP: '127.0.0.1',
    PORT: 9090,
    API: 'api.php',
  };

  public readonly debug = true;

  constructor() {
  }

  get user(): UserBean {
    return this._user;
  }


  set user(value: UserBean) {
    this._user = value;
  }
}
