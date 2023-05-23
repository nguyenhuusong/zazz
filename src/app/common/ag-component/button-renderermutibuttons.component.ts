// Author: T4professor

import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
    selector: 'app-button-renderer',
  // template: `<p-splitButton icon="pi pi-bars"  styleClass="p-button-sm" [appendTo]="'body'" [baseZIndex]="99999999" [model]="items"></p-splitButton>`
  // template: `
  // <button pButton pRipple type="button" icon="pi pi-ellipsis-v" (click)="menu.toggle($event)" class="p-button-rounded p-button-text"></button>
  // <p-menu styleClass="p-menu-buttons menu-agrid" [showTransitionOptions]="'0ms'" [hideTransitionOptions]="'0ms'" #menu [popup]="true" [model]="items" [appendTo]="'body'"></p-menu>
  // `
  template: `
      <p-splitButton *ngIf="items.length > 0" [label]="this.params.buttons[0].label"  styleClass="p-button-sm p-button-outlined" (onClick)="onClick($event, 0)" [model]="items" [appendTo]="'body'" ></p-splitButton>
  `
})

export class ButtonAgGridComponent implements ICellRendererAngularComp {

  params: any;
  items: MenuItem[] = [];
  label: string = '';
  agInit(params: any): void {
    this.params = params;
    for(let index in this.params.buttons) {
      if(!this.params.buttons[index].hide) {
        const object ={label:  this.params.buttons[index].label, icon: this.params.buttons[index].icon , key: this.params.buttons[index].key,  command: ($event: any) => {
          this.onClick($event,index);
        }}
        this.items.push(object);
      }
      
    }
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any, idx: any) {
    if (this.params.buttons[idx].onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data,
        index: this.params.rowIndex
        // ...something
      };
      this.params.buttons[idx].onClick(params);
    }
  }
}
