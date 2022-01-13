import { Component } from '@angular/core';

@Component({
  selector: 'app-normal-button-renderer',
  template: `
  <button style="padding:4px" *ngFor="let item of params.buttons; let i = index"
          [attr.data-toggle]='item.isModal ? "modal" : ""' [attr.data-target]="item.isModal ? item.target : ''"
   title={{item.label}} type="button" (click)="onClick($event, i)" [hidden]="item.hidden ? item.hidden : false"
                                  class="btn {{item.class}}">
                                  <i class="fa {{item.icon}}"></i>
                                </button>
    `
})
export class NormalButtonRendererComponent  {
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
