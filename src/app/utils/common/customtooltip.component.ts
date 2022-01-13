import { Component } from '@angular/core';
import { ITooltipAngularComp } from '@ag-grid-community/angular';

// <p *ngIf="isAmount">{{ data[params.colDef?.field] | currencyFormat  }}</p>
@Component({
  selector: 'app-custom-tooltip',
  template: `
    <div *ngIf="data" class="custom-tooltip">
        <div [ngClass]="'panel panel-' + data?.type">
          <div class="panel-heading">
            <h3 class="panel-title">{{ params.colDef?.headerName }}</h3>
          </div>
          <div class="panel-body">
            <p *ngIf="!isAmount && !isHtml && params.colDef?.field.indexOf('margin') === -1 ">{{ data[params.colDef?.field]  }}</p>
            <p *ngIf="!isAmount && isHtml" [innerHTML]="data[params.colDef?.field]"></p>
         
            <p *ngIf="!isAmount && !isHtml && params.colDef?.field.indexOf('margin') > -1">{{data[params.colDef?.field]| marginRound: 2 }}</p>
          </div>
        </div>
      </div>
    `,
  styles: [
    `
      :host {
        position: absolute;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: normal;
        word-wrap: break-word;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})

export class CustomTooltipComponent implements ITooltipAngularComp {
  public params: any;
  public data: any;
  isAmount = false;
  isHtml = false;

  agInit(params): void {
    this.params = params;
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
