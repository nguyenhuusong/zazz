import { Component } from '@angular/core';
import { ITooltipAngularComp } from '@ag-grid-community/angular';


@Component({
  selector: 'app-tooltip-suggestion',
  template: `
    <div *ngIf="data" class="custom-tooltip">
        <div class="panel panel-suggestion">
          <div class="panel-heading">
            <h3 class="panel-title">{{ content }}</h3>
          </div>
          <div class="panel-body">
          </div>
        </div>
      </div>
    `,
  styles: [
    `
      :host {
        position: absolute;
        overflow: visible;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})

export class TooltipSuggestionComponent implements ITooltipAngularComp {
  public params: any;
  public data: any;
  content = '';

  agInit(params): void {
    this.params = params;

    if (this.params.rowIndex === 0) {
      this.data = this.params.api.getDisplayedRowAtIndex(0).data;
    }

    if (this.params.rowIndex) {
      this.data = params.api.getDisplayedRowAtIndex(this.params.rowIndex).data;
    }

    this.content = this.params.content || '';

  }

}
