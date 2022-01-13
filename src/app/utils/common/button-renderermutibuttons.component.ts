// Author: T4professor

import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MenuItem } from 'primeng/api';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
    selector: 'app-button-renderer',
  template: `<p-splitButton icon="pi pi-bars" (onDropdownClick)="conddd($event)" styleClass="p-button-sm" [appendTo]="'body'" [model]="items"></p-splitButton>
    `
})

export class ButtonRendererMutiComponent implements ICellRendererAngularComp {

  params;
  items: MenuItem[] = [];
  label: string;
  agInit(params): void {
    this.params = params;
    for(let index in this.params.buttons) {
      if(!this.params.buttons[index].hide) {
        const object ={label:  this.params.buttons[index].label, icon: this.params.buttons[index].icon, command: ($event) => {
          this.onClick($event,index);
        }}
        this.items.push(object);
      }
      
    }
  }

  conddd(e) {
    console.log(e)
  }
  refresh(params?: any): boolean {
    return true;
  }

  onClick($event, idx) {
    console.log(this.params);
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
