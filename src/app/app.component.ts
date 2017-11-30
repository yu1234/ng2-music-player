import {Component, OnInit, Renderer2, ElementRef, OnDestroy} from '@angular/core';
import {EventBusService} from './service/event-bus.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private eventBusService: EventBusService) {
  }

  ngOnInit() {
    this.initPage();
    this.subscribeEvent();
  }

  /**
   *   初始化背景
   */

  initPage() {
    // 背景图片初始化
    $('#blur-img').backgroundBlur({
      blurAmount: 50, // 模糊度
      imageClass: 'blured-img', // 背景区应用样式
      endOpacity: 1, // 图像最终的不透明度
      duration: 1000
    });
    // 遮罩层淡出
    $('.blur-mask').fadeIn(1000);   // 遮罩层淡出
  }

  /**
   * 修改背景
   * @param imgPath 图片路径
   */
  changeBackground(imgPath: string) {
    $('#blur-img').backgroundBlur(imgPath);    // 替换图像并淡出
    $('#blur-img').animate({opacity: '1'}, 2000); // 背景更换特效
  }

  subscribeEvent() {
    // 订阅事件
    this.eventBusService.eventBus.subscribe(event => {
        if (event.cover) {
          this.changeBackground(event.cover);
        }
      }
    );
  }

  ngOnDestroy() {
   // this.eventBusService.playDataEventBus.unsubscribe();
  }
}

