import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {EventBusService} from '../../service/event-bus.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(private eventBusService: EventBusService, private el: ElementRef) {
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
    $(this.el.nativeElement.querySelector(`#blur-img`)).backgroundBlur({
      blurAmount: 80, // 模糊度
      endOpacity: 1, // 图像最终的不透明度
      duration: 2000,
      fadeIn: 2000
    });
    // 遮罩层淡出
    $(this.el.nativeElement.querySelector(`.blur-mask`)).fadeIn(2000);   // 遮罩层淡出
    $(this.el.nativeElement.querySelector(`#blur-img`)).backgroundBlur(`assets/images/1.jpg`);
    RGBaster.colors(`assets/images/1.jpg`, {
      // 调色板大小，就是提取的样本，越大越精确，同时性能越差
      paletteSize: 30,
      // 颜色排除
      exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
      success: (payload) => {
        $(this.el.nativeElement.querySelector(`#main`)).css(`background-color`, payload.dominant);
      }
    });
  }

  /**
   * 修改背景
   * @param imgPath 图片路径
   */
  changeBackground(imgPath: string) {
    $(this.el.nativeElement.querySelector(`#blur-img`)).backgroundBlur(imgPath);    // 替换图像并淡出
    $(this.el.nativeElement.querySelector(`#blur-img`)).animate({opacity: '1'}, 2000); // 背景更换特效
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
