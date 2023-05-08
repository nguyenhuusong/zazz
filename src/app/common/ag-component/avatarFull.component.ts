import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'child-avatar',
  template: `
    <div *ngIf="isImage">
    <p-avatar *ngIf="value" image="{{value ? value: ''}}" [style]="{'display': 'flex'}" styleClass="d-flex" [shape]="isCircle ? 'circle' : ''"></p-avatar>
    <p-avatar *ngIf="!value"  icon="pi pi-user" styleClass="mr-2" [style]="{'background-color': '#0a58ca', 'color': '#f68c1f'}" styleClass="d-flex"  [shape]="isCircle ? 'circle' : ''"></p-avatar>
    </div>
    <div *ngIf="!isImage">
    <p-avatar image="{{value}}" [style]="{'display': 'flex'}" size="large"  [shape]="isCircle ? 'circle' : ''" styleClass="d-flex"></p-avatar>
    </div>
    `
})
export class AvatarFullComponent implements OnInit {
  value: string;
  isImage = true;
  isCircle = true;
  constructor() { }

  agInit(params: any) {
    this.value = params.value;
    if(params.colDef.cellClass && params.colDef.cellClass.length > 0) {
      this.isCircle = params.colDef.cellClass.indexOf('square') > -1 ? false : true
    }else {
      this.isCircle = true;
    }
    if(params.data.hasOwnProperty('back_url') && params.data.hasOwnProperty('front_url')) {
      this.isImage = false;
    }else {
      this.isImage = true;
    }
  }
 
  ngOnInit() {
  }

}
