import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-eating-list',
  templateUrl: './eating-list.component.html',
  styleUrls: ['./eating-list.component.scss']
})
export class EatingListComponent implements OnInit, AfterViewChecked {

  dataAnCa: any;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  rowDataSelected:any = []
  detailInfo = null
  listViews = [];
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private organizeInfoService: OrganizeInfoService,
    private router: Router) {
  }
  listStatus = [];
  listOrgRoots = [];
  displayFrom = false;
  pagingComponent = {
    total: 0
  }

  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs = [];
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  paramsObject = null
  query = {
    cusId: null,
    offSet: 0,
    pageSize: 15,
    fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  listsData = [];
  displaySetting = false;
  gridKey = ''
  isDetail = false;
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update',  icon: 'pi pi-check'  }
  ]
  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách ăn ca', routerLink: '/chinh-sach/an-ca/' },
      { label: 'Chi tiết danh sách ăn ca' },
    ];
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.query.cusId = this.paramsObject.params.cusId;
      this.load();
    });
  };
  
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      cusId: this.query.cusId,
      offSet: 0,
      pageSize: 15,
      fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
      todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    }
    this.load();
  }
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = {... this.query};
    delete params.fromdate
    delete params.todate
    params.FromDate = moment(new Date(this.query.fromdate)).format('YYYY-MM-DD')
    params.ToDate = moment(new Date(this.query.todate)).format('YYYY-MM-DD');
    const queryParams = queryString.stringify(params);

    this.apiService.getEatingList(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.result.dataList.data;
        this.gridKey= results.data.result.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols =  results.data.result.gridflexs;
          // this.colsDetail =  results.data.result.gridflexdetails ?  results.data.result.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.result.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.result.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.result.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.result.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.result.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.xoaAnca.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEatingPage.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  xoaAnca(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ EatingId: event.rowData.id });
        this.apiService.delEatingInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
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


  XemChiTiet(event) {
    const params = {
      custId: event.rowData.custId
    }
    this.router.navigate(['/chinh-sach/an-ca/chi-tiet-an-ca'], { queryParams: params });
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  addNew() {
    this.detailInfo = []
    this.listViews = []
    this.isDetail = true;
    const params = { cusId: null }
    this.apiService.getEatingForCreateInfo(queryString.stringify(params)).subscribe( results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = [...listViews];
        this.detailInfo = results.data;
      }
    }) 
  }

  setChitiet(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEatingInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.isDetail = false;
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  goBack() {
      this.router.navigate(['/chinh-sach/cham-cong']);
  }

  quaylai(event) {

  } 

}


