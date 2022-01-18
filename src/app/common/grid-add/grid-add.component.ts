import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Table } from 'primeng/table';
import * as queryString from 'querystring';
import * as moment from 'moment';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AgGridFn } from '../function-common/common';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';

@Component({
  selector: 'app-grid-add',
  templateUrl: './grid-add.component.html',
  styleUrls: ['./grid-add.component.css']
})
export class GridAddComponent implements OnInit, OnChanges {
  cols: any[];
  public modules: Module[] = AllModules;
public agGridFn = AgGridFn;
  colsDetail: any[];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  objectAction: any;
  getRowHeight
  pagingComponent = {
    total: 0
  }
  rowSelection = 'multiple'
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false
  first = 0
  @Input() dataLists;
  @Input() dataSelects = [];
  @Input() isPositions;
  @Input() type = 'companyId';
  @Input() columnDefs;
  @Output() callback = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  query = {
    filter: '',
    storeId: '',
    supplier_id: '',
    status: null,
    order_type: 1,
    offset: 0,
    fromDate: null,
    toDate: null,
    pageSize: 25
  }
  orders = [];
  rows = 10;
  totalRecords = 0;
  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      if (params.node.master) {
        return 40
      } else {
        return 300;
      }
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
    };
  }

  ngOnInit(): void {
    this.getListOrder();
  }

  getListOrder() {
    const query = { ...this.query };
    const params = queryString.stringify(query);
    // this.apiService.getInheritOrder(params).subscribe(results => {
    //   if (results && results.statusCode === 1) {
    //     this.loading = false;
    //     this.orders = results.data;
    //     this.pagingComponent.total = results.recordsTotal;
    //     this.countRecord.totalRecord = results.recordsTotal;
    //     this.countRecord.currentRecordStart = this.query.offset + 1;
    //     if ((results.recordsTotal - this.query.offset) > this.query.pageSize) {
    //       this.countRecord.currentRecordEnd = this.query.offset + Number(this.query.pageSize);
    //     } else {
    //       this.countRecord.currentRecordEnd = results.recordsTotal;
    //     }
    //     this.initGridView();
    //   }
    // }, error => {
    //   this.loading = false;
    // });
  }

  cellMouseDown(event) {
    if (event.node.selected) {
      event.node.setSelected(false);
    } else {
      event.node.setSelected(true);
    }
  }

  onGridReady(params) {
    console.log(this.type)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.dataSelects.length > 0) {
      this.gridApi.forEachNode( (node) =>{
        if (this.dataSelects.map(d => d[this.type]).indexOf(node.data[this.type]) > -1) {
          node.setSelected(true);
        }
      });
    }

  }

  ngOnChanges() {
    setTimeout(() => {
      this.sizeToFit()
    }, 500);
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  yes() {
    this.callback.emit(this.gridApi.getSelectedRows())
  }

  no() {
    this.close.emit();
  }

}
