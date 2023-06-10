import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from '@ag-grid-community/core';
import { Component, OnInit } from '@angular/core';
import { AgGridFn } from '../function-common/common';

@Component({
  selector: 'app-detail-renderer-grid',
  template: `<div>
    <app-list-grid-angular *ngIf="colDefs.length > 0" 
            [listsData]="rowData" 
            [domLayout]="'autoHeight'"
            [rowSelection]="'multiple'" 
            [idGrid]="'prints'" 
            (gridReady)="onGridReady($event)"
            (callback)="rowSelected($event)" 
            [columnDefs]="colDefs"></app-list-grid-angular>
  </div>`,
})
export class DetailRendererGrid implements OnInit {
  params!: ICellRendererParams;
  masterGridApi!: GridApi;
  rowId!: string;
  colDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData!: any[];
  col: any

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.col = params.data.gridflexs;
    this.rowData = params.data.contractFiles;
    this.initGrid()
  }

  // called when the cell is refreshed
  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  onGridReady(event) {
    
  }

  ngOnDestroy(): void {
   
  }
  
  rowSelected(event) {
    console.log('event child', event)
  }

  ngOnInit(): void {
  }

  initGrid() {
    this.colDefs = [
    {
        filter: '',
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: ''
        },
      ...AgGridFn(this.col.filter((d: any) => !d.isHide)),
    ]

  }
}