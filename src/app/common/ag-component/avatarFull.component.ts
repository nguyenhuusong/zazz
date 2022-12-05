import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'child-avatar',
  template: `
    <div >
    <img  src="{{value ? value: ''}}" alt=""  style="width:50%">
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
