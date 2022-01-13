import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'child-avatar',
  template: `
    <div class="avatar-wrap">
    <img  src="{{value ? value: '/assets/images/avatar.jpg'}}" alt=""  style="width:50px; max-height: 50px; padding: 5px">
    </div>
    `
})
export class AvatarFullComponent implements OnInit {
  value: string
  constructor() { }

  agInit(params: any) {
    this.value = params.value;
  }
  ngOnInit() {
  }

}
