  import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
declare var $: any;
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-page-mau-thong-bao',
  templateUrl: './page-mau-thong-bao.component.html',
  styleUrls: ['./page-mau-thong-bao.component.css']
})
export class PageMauThongBaoComponent implements OnInit, OnDestroy, AfterViewChecked {
  agGridFn = AgGridFn;
  public modules: Module[] = AllModules;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
   ) {
    this.defaultColDef = {
      resizable: true,
    };
    this.frameworkComponents = {
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarFullComponent: AvatarFullComponent,
    };
    this.getRowHeight = function (params) {
      return 50;
    };
  }
  items: any = [];
  model: any = {};
  totalRecord = 0;
  projects = [];
  query = {
    org_cd: '',
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15
  }
  cols
  colsDetail;
  objectActionDetail
  dataNotifyTemp
  destroy$: Subject<boolean> = new Subject<boolean>();
  columnDefs;
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  gridflexdetails: any;
  objectAction: any;
  objectActionDetails: any;
  getRowHeight;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  clientWidth = 0;
  pagingComponent = {
    total: 0
  }
  first = 0;
  
  handleReset() {
    this.query = {
      org_cd: '',
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15
    }
  }

  changePageSize() {
    this.load();
  }


  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.clientWidth = $('#myGrid')[0].clientWidth;
    this.model.filter = '';
    this.load();
  }


  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }
  load() {
    this.query.gridWidth = this.clientWidth
    this.spinner.show();
    let params = { ...this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getNotifyTempPage(queryParams).subscribe(
      (results: any) => {
        this.dataNotifyTemp = results.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
          this.cols.forEach(column => {
            if (column.columnField === 'actions') {
              this.objectAction = column;
            }
          });
          this.colsDetail.forEach(column => {
            if (column.columnField === 'actions') {
              this.objectActionDetail = column;
            }
          });
        }
        this.initTableGrid();
        this.spinner.hide();
        this.pagingComponent.total = this.dataNotifyTemp.dataList.recordsTotal;
        this.countRecord.totalRecord = this.dataNotifyTemp.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
        if ((this.dataNotifyTemp.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = this.dataNotifyTemp.dataList.recordsTotal;
        }
      },
      error => { });
  }

  initTableGrid() {
    this.columnDefs = [
      ...this.agGridFn(this.cols),
      {
        headerName: 'Chức năng',
        field: 'button',
        filter: '',
        width: 120,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
        cellRendererParams: params => this.showButtons(params)
      },
    ];
    this.groupDefaultExpanded = 0;
    this.detailRowHeight = 300;
  }

  showButtons(params) {
    return {
      buttons: [
        // {
        //   onClick: this.handleNotificationPush.bind(this),
        //   label: 'Thông báo',
        //   icon: 'fa fa-bullhorn',
        //   class: 'btn-dropbox text-white',
        //   show: true
        // },
        {
          onClick: this.handleEdit.bind(this),
          label: 'Sửa',
          icon: 'fa fa-edit',
          class: 'btn-dropbox text-white',
          // show: this.checkAction('/page-notify', 'edit')
        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-google text-white',
          // show: this.checkAction('/page-notify', 'delete')
        }
      ]
    };
  }

  
  handleDelete(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        this.spinner.show();
        const queryParams = queryString.stringify({ tempId: e.rowData.tempId });
        this.apiService.delNotifyTemp(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
            this.spinner.hide();
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  handleEdit(event) {
    const params = {
      tempId: event.rowData.tempId,
    }
    this.router.navigate(['/thong-bao/mau-thong-bao/chi-tiet-mau-thong-bao'], { queryParams: params });
  }

  addNotifyTemp() {
    const params = {
      tempId: '',
    }
    this.router.navigate(['/thong-bao/mau-thong-bao/them-moi-mau-thong-bao'], { queryParams: params });
  }
 
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleFilter() {
    this.load();
  }
}
