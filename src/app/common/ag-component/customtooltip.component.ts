import { ITooltipAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';



@Component({
  selector: 'tooltip-component',
  template: ` <div class="custom-tooltip" [style.background-color]="color">
    <p>
      <span>{{ params.colDef?.headerName }}</span>
    </p>
    <p >
    <span *ngIf="data"> {{ data[params.colDef?.field] }}</span>
  </p>
   
  </div>`,
  styles: [
    `
      :host {
        position: absolute;
        width: 150px;
        height: 70px;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;

      }

      .custom-tooltip p {
        margin: 5px;
        padding-bottom: 5px

      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})


export class CustomTooltipComponent implements ITooltipAngularComp {
  public params: any;
  public data: any = null;
  isAmount = false;
  isHtml = false;
  public color: string = '';
  agInit(params: any): void {
    this.params = params;
    this.color = this.params.color || 'white';
    if (this.params.rowIndex === 0) {
      this.data = this.params.api.getDisplayedRowAtIndex(0).data;
      this.data.type = this.params?.type || 'primary';
      this.pipeCheckTransform();
    }

    if (this.params.rowIndex) {
      this.data = this.params.api.getDisplayedRowAtIndex(this.params.rowIndex).data;
      this.data.type = this.params?.type || 'primary';
      this.pipeCheckTransform();
    }

  }

  pipeCheckTransform(): void {
    if (this.params.colDef.field.indexOf('amount') > -1 || this.params.colDef.field.indexOf('price') > -1 ||
    this.params.colDef.field.indexOf('profit') > -1 || this.params.colDef.field.indexOf('revenue') > -1 || this.params.colDef.field.indexOf('promotion_by_value') > -1
    || this.params.colDef.field.indexOf('promotion_value') > -1
    ) {
      this.isAmount = true;
    } else {
      this.isAmount = false;
      if (typeof(this.data[this.params.colDef.field]) === 'string' && this.data[this.params.colDef.field].indexOf('<span') > -1) {
        this.isHtml = true;
      } else {
        this.isHtml = false;
      }
    }
  }
}
