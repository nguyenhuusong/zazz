import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-phep-bu',
  templateUrl: './phep-bu.component.html',
  styleUrls: ['./phep-bu.component.scss']
})
export class PhepBuComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  items = []
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }
  frameworkComponents;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs= [];
  defaultColDef;
  gridApi: any;
  clientWidth: any;
  gridflexs: any;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 15,
    year: 0,
    month: 0,
    organizeId: ''
  }
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false;

  loadjs = 0;
  heightGrid = 0
  isShowAddPhepBuDep = false;
  querAddNewPhepBuDep = {
    orgId: '',
    annualAdd: '',
    annualMonth: ''
  }
  orgId: ''
  annulOptions = []
  departments = []
  organizeIdForDep = ''
  months = []
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + e.clientHeight + 15;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
      year: 0,
      month: 0,
      organizeId: '',
    }
    this.load();
  }
load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getAnnualAddPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.delRecord.bind(this),
          label: 'Xóa',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  XemChiTiet(event) {
    const params = {
      annualId: event.rowData.annualId
    }
    this.router.navigate(['/chinh-sach/phep-bu/chi-tiet-phep-bu'], { queryParams: params });
  }
  delRecord(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa phép bù?',
      accept: () => {
        const queryParams = queryString.stringify({ annualId: event.rowData.annualId });
        this.apiService.delAnnualAddInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa phép bù thành công' });
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

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Phép bù' },
    ];
    this.load();
    this.getOrgRoots();
    this.months = [
      {label: 'Tháng 1', value: 1},
      {label: 'Tháng 2', value: 2},
      {label: 'Tháng 3', value: 3},
      {label: 'Tháng 4', value: 4},
      {label: 'Tháng 5', value: 5},
      {label: 'Tháng 6', value: 6},
      {label: 'Tháng 7', value: 7},
      {label: 'Tháng 8', value: 8},
      {label: 'Tháng 9', value: 9},
      {label: 'Tháng 10', value: 10},
      {label: 'Tháng 11', value: 11},
      {label: 'Tháng 12', value: 12},
    ]
  }

  organizeId = ''
  orgRoots = [];
  getOrgRoots() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.orgRoots = results.data.map(d => {
          return {
            label: d.organizationName + '-' + d.organizationCd,
            value: `${d.organizeId}`
          }
        });
        this.orgRoots = [{label: 'Tất cả', value: null}, ...this.orgRoots]
      }
    })
  }


  addNewPhepBu() {
    const params = {
      annualId: ""
    }
    this.router.navigate(['/chinh-sach/phep-bu/them-moi-phep-bu'], { queryParams: params });
  }
  addNewPhepBuDep() {
    this.isShowAddPhepBuDep = true;
  }
  // thêm mới Phép bù phòng ban
  setPhepBuDep() {
    console.log('fjodsfji');
    // if(this.querAddNewPhepBuDep.orgId === '' || this.querAddNewPhepBuDep.annualAdd === '' || this.querAddNewPhepBuDep.annualMonth === ''){
    //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng điền đủ thông tin' });
    // }else{
      this.apiService.setAnnualAddOrgInfo(this.querAddNewPhepBuDep).subscribe((results: any) => {
        // console.log(results, 'fjdsofio')
        // if (results.status === 'success') {
        //   this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới thành công' });
        // }else{
        //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        // }
      })
    // }
  }
  chonToChuc() {
    this.querAddNewPhepBuDep.orgId = '';
    if(this.organizeIdForDep){
      this.getDepartments(this.organizeIdForDep);
    }
  }
  getDepartments(parentId) {
    const queryParams = queryString.stringify({ parentId: parentId })
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.departments = results.data;
      }
    })

  }

}


