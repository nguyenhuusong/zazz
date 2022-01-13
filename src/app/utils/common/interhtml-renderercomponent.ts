// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
// import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  selector: 'app-button-renderer',
  template: `<div [innerHTML]=""></div> <button style="padding:7px"
  title={{item.label}} type="button" *ngIf="item?.show" (click)="onClick($event, i)"
                                 class="btn {{item.class}}">
                                 <i class="fa {{item.icon}}"></i>
                               </button>
    `
})

export class ButtonRendererComponent1 implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
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
