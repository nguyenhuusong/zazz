import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'child-avatar',
  template: `
    <div >
    <img  src="{{value ? value: ''}}" alt=""  style="width: 50px">
    </div>
    `
})
export class AvatarFullComponent implements OnInit {
  value: string;
  isImage = true;
  constructor() { }

  agInit(params: any) {
    this.value = params.value;
    if(params.data.hasOwnProperty('back_url') && params.data.hasOwnProperty('front_url')) {
      this.isImage = false;
    }else {
      this.isImage = true;
    }
  }
  ngOnInit() {
  }

}
