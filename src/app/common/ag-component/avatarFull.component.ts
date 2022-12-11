import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'child-avatar',
  template: `
    <div *ngIf="isImage">
    <p-avatar *ngIf="value" image="{{value ? value: ''}}" [style]="{'display': 'flex'}" styleClass="d-flex" shape="circle"></p-avatar>
    <p-avatar *ngIf="!value"  icon="pi pi-user" styleClass="mr-2" [style]="{'background-color': '#9c27b0', 'color': '#ffffff'}" styleClass="d-flex" shape="circle"></p-avatar>
    </div>
    <div *ngIf="!isImage">
    <p-avatar image="{{value}}" [style]="{'display': 'flex'}" size="large" styleClass="d-flex"></p-avatar>
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
