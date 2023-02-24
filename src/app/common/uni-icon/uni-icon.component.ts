import { Component, Input, } from '@angular/core';
@Component({
  selector: 'app-uni-icon',
  templateUrl: './uni-icon.component.html',
  styleUrls: ['./uni-icon.component.css'],
})
export class UniIconComponent {
  @Input() name: string;
  @Input() size = 16;
  @Input() fill = 'currentColor';
  @Input() nzTooltipMouseEnterDelay: string = '0.3';
  @Input() nzTooltipTitle = '';
  window: any = window;

  constructor() {}

  get iconUrl() {
    return `${this.window.location.href}#${this.name}`;
  }
}
