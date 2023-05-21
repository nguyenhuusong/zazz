import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, AgGridFnEdit } from 'src/app/common/function-common/common';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-config-grid-table-form',
  templateUrl: './config-grid-table-form.component.html',
  styleUrls: ['./config-grid-table-form.component.scss']
})
export class ConfigGridTableFormComponent implements OnInit {
  dataRouter: any;
  @Input() gridKey;
  @Output() callbackF = new EventEmitter<any>();
  @Input() typeConfig;
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router) {
    this.dataRouter = this.route.data['_value'];
  }
  pagingComponent = {
    total: 0
  }
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  detailCellRendererParams;
  gridflexs: any;
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 10000000,
    gridKey: '',
    tableKey: ''
  }
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loadjs = 0;
  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    let params = {...this.query}
    if(this.typeConfig === 'FormInfo') {
      params.tableKey =params.gridKey
      delete params.gridKey;
    }else {
      params.gridKey =params.gridKey
      delete params.tableKey;
    }
    const queryParams = queryString.stringify(params);
    this.apiService.getGridViewPage(this.typeConfig === 'FormInfo' ? 'GetFormViewPage' : 'GetGridViewPage', queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data.map(d => {
          return {
            ...d, error : false
          }
        });
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        }
        this.spinner.hide();
      }), error => {
        this.spinner.hide();
      };
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.chitietgroup.bind(this),
          label: 'Chi tiết group',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.Delete.bind(this),
          label: 'Xóa',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        },
        
      ]
    };
  }

  chitietgroup(event) {
    this.callbackF.emit(event.rowData.group_cd)
  } 

  initGrid() {
    this.columnDefs = [
      ...AgGridFnEdit(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  Delete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa bản ghi này?',
      accept: () => {
        let queryParams = null;
        if(this.typeConfig === 'FormInfo') {
          queryParams = queryString.stringify({ fieldId: event.rowData.id });
        }else {
          queryParams = queryString.stringify({ gridId: event.rowData.id });
        }
        // this.apiService.delFormViewInfo(this.typeConfig === 'FormInfo' ? 'DelFormViewInfo' : 'DelGridViewInfo', queryParams).subscribe(results => {
        //   if (results.status === 'success') {
        //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
        //     this.load();
        //   } else {
        //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        //   }
        // });
      }
    });
  }

  doubleClicked(event) {
    this.load();
  }

  find() {
    this.load();
  }

  ngOnInit() {
    this.query.gridKey = this.gridKey;
    this.load();
  }
}




