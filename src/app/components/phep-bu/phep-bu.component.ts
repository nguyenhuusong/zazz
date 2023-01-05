import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
@Component({
  selector: 'app-phep-bu',
  templateUrl: './phep-bu.component.html',
  styleUrls: ['./phep-bu.component.scss']
})
export class PhepBuComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  listsData: any[] = [];
  items = []
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    private dialogService: DialogService,
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
    this.getFilter();
  }
  frameworkComponents;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  defaultColDef;
  gridApi: any;
  clientWidth: any;
  gridflexs: any;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    year: moment().year(),
    month: moment().month() + 1,
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
  orgId: '';
  annulOptions = [];
  departments = [];
  organizeIdForDep = '';
  months = [];
  itemsToolOfGrid: any[] = [];
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
      year: moment().year(),
      month: moment().month(),
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getAnnualAddPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
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
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.delRecord.bind(this),
          label: 'Xóa',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.DELETE)
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
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 70,
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
    this.getDepartments();
    let currentDay = new Date().getDate();
    if(currentDay >= 25 && currentDay <= 31){
      this.query.month = this.query.month + 1;
    }
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Phép năm', routerLink: '/chinh-sach/phep-nam' },
      { label: 'Phép bù' },
    ];
    this.months = [
      { label: 'Tháng 1', value: 1 },
      { label: 'Tháng 2', value: 2 },
      { label: 'Tháng 3', value: 3 },
      { label: 'Tháng 4', value: 4 },
      { label: 'Tháng 5', value: 5 },
      { label: 'Tháng 6', value: 6 },
      { label: 'Tháng 7', value: 7 },
      { label: 'Tháng 8', value: 8 },
      { label: 'Tháng 9', value: 9 },
      { label: 'Tháng 10', value: 10 },
      { label: 'Tháng 11', value: 11 },
      { label: 'Tháng 12', value: 12 },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Thêm mới phép bù phòng ban',
        code: 'themmoi',
        icon: 'pi pi-plus',
        command: () => {
          this.addNewPhepBuDep();
        },
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.ADD_PHEP_BU_PHONG_BAN),
      },
      {
        label: 'Import',
        code: 'import',
        icon: 'pi pi-file-excel',
        command: () => {
          this.importFileExel();
        },
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.IMPORT),
      },
    ]
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
    let params: any = { ...this.querAddNewPhepBuDep };
    params.orgId = params.orgId.orgId;
    this.apiService.setAnnualAddOrgInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới thành công' });
        this.isShowAddPhepBuDep = false
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    })
  }
  chonToChuc() {
    // this.querAddNewPhepBuDep.orgId = '';
    // if (this.organizeIdForDep) {
    //   this.getDepartments(this.organizeIdForDep);
    // }
  }
  getDepartments() {
    const queryParams = queryString.stringify({  })
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.departments = results.data;
      }
    })

  }

  changeMonth(event) {
    if(this.query.month > 12){
      this.query.month = 12;
    }else if(this.query.month < 1){
      this.query.month = 1;
    }
  }

  importFileExel() {
    this.router.navigate(['/chinh-sach/phep-bu/import']);
  }


  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addNewPhepBu()
        });
      }
    }, 300);
  }

  getFilter() {
    this.apiService.getFilter('/api/v2/annualleave/GetAnnualLeaveFilter').subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        this.FnEvent();
        this.detailInfoFilter = results.data;
      }
    });
  }
  
   filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
    this.FnEvent();
  }

  close(event) {
    const listViews = cloneDeep(this.cloneListViewsFilter);
    this.listViewsFilter = cloneDeep(listViews);
    const params =  getParamString(listViews)
    this.query = { ...this.query, ...params};
    this.load();
    this.FnEvent();
  }

showFilter() {
    const ref = this.dialogService.open(FormFilterComponent, {
      header: 'Tìm kiếm nâng cao',
      width: '40%',
      contentStyle: "",
      data: {
        listViews: this.listViewsFilter,
        detailInfoFilter: this.detailInfoFilter,
        buttons: this.optionsButonFilter
      }
    });

    ref.onClose.subscribe((event: any) => {
      if (event) {
        this.listViewsFilter = cloneDeep(event.listViewsFilter);
        if (event.type === 'Search') {
          this.query = { ...this.query, ...event.data };
          this.load();
        } else if (event.type === 'CauHinh') {
        this.apiService.getFilter('/api/v2/annualleave/GetAnnualLeaveFilter').subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.listViewsFilter = [...listViews];
              const params =  getParamString(listViews)
              this.query = { ...this.query, ...params};
              this.load();
              this.detailInfoFilter = results.data;
              this.showFilter()
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.cloneListViewsFilter);
          this.listViewsFilter = cloneDeep(listViews);
         const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        }
      }
    });
  }



}


