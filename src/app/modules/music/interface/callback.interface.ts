/**
 * Created by yuliu on 2017/11/13 0013.
 */
import {Song} from '../bean/song';
/**
 * 播放出错回调接口
 */
export interface PlayCallback {
  playErrorCallback(): any;
  playSuccessCallback(song?: Song): any;
}
