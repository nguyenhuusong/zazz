import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';


@Component({
  selector: 'app-dropdown-renderer',
  template: ` <span>{{ value }}</span> `,
})
export class DropdownRendererComponent implements INoRowsOverlayAngularComp {
  value: any;

  agInit(params): void {
    this.value = params.value;
  }

}
