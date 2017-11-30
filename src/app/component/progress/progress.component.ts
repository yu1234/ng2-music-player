import {Component, OnInit, ElementRef, AfterViewInit, OnDestroy, Output, Input, EventEmitter} from '@angular/core';
import {DefaultArgs} from '../../global-data';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
declare var $: any;
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, AfterViewInit, OnDestroy {

  // 加载进度条html元素
  private bar: HTMLBaseElement;
  private dotEl: HTMLBaseElement;
  private curEl: HTMLBaseElement;

  private minLength: number;
  private maxLength: number;
  private windowSubscription: Subscription;
  @Input() private locked = false;
  private mDown = false;
  private _percent = 0;


  @Output() callbackEvent = new EventEmitter<number>();

  constructor(private el: ElementRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.bar = this.el.nativeElement.querySelector('.mkpgb-area');
    this.dotEl = this.el.nativeElement.querySelector('.mkpgb-dot');
    this.curEl = this.el.nativeElement.querySelector('.mkpgb-cur');
    this.initProgress();
  }

  /**
   * 进度条初始化
   */
  initProgress() {
    // 获取偏移量
    this.minLength = $(this.bar).offset().left;
    this.maxLength = $(this.bar).width() + this.minLength;
    // 窗口大小改变偏移量重置
    this.windowSubscription = Observable.fromEvent(window, 'resize')
      .debounceTime(100) // 以免频繁处理
      .subscribe((event) => {
        this.minLength = $(this.bar).offset().left;
        this.maxLength = $(this.bar).width() + this.minLength;
        if (DefaultArgs.debug) {
          console.log('进度条左偏移量', this.maxLength);
        }
      });
    // 监听小点的鼠标按下事件
    this.dotEl.onmousedown = (ev: MouseEvent) => {
      ev.preventDefault();    // 取消原有事件的默认动作
    };
    // 监听进度条整体的鼠标按下事件
    this.bar.onmousedown = (ev: MouseEvent) => {
      if (!this.locked) {
        this.mDown = true;
      }
      this.barMove(ev);
    };
    // 监听鼠标移动事件，用于拖动
    $('html').mousemove((e: MouseEvent) => {
      this.barMove(e);
    });
    // 监听鼠标弹起事件，用于释放拖动
    $('html').mouseup((e: MouseEvent) => {
      this.mDown = false;
    });
  }

  /**
   * 进度条移动方法
   * @param ev
   */
  barMove(ev: MouseEvent) {
    if (this.mDown) {
      let percent = 0;
      if (ev.clientX < this.minLength) {
        percent = 0;
      } else if (ev.clientX > this.maxLength) {
        percent = 1;
      } else {
        percent = (ev.clientX - this.minLength) / (this.maxLength - this.minLength);
      }
      this.callback(percent);
      this.goto(percent);
    }
  }

  /**
   * 跳转至某处
   * @returns {boolean}
   */
  goto(percent: number): boolean {
    if (percent > 1) {
      percent = 1;
    }
    if (percent < 0) {
      percent = 0;
    }
    this._percent = percent;
    $(this.dotEl).css('left', (percent * 100) + '%');
    $(this.curEl).css('width', (percent * 100) + '%');
    return true;
  }

  /**
   * 锁定进度条
   */
  lock(isLock: boolean): boolean {
    if (isLock) {
      this.locked = true;
    } else {
      this.locked = false;
    }
    return true;
  }

  /**
   * 回调函数
   */
  callback(percent: number) {
    this.callbackEvent.emit(percent);
  }

  ngOnDestroy() {
    this.windowSubscription.unsubscribe();
  }

  @Input() set percent(percent: number) {
    this._percent = percent;
    this.goto(percent);
  }
}
