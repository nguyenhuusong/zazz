import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-cs-tien-luong',
  templateUrl: './cs-tien-luong.component.html',
  styleUrls: ['./cs-tien-luong.component.scss']
})
export class CsTienLuongComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  dataTienLuong: any;
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    public dialogService: DialogService,
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }

  modelAdd = {
    date: new Date(),
  }
  listOrgRoots = [];
  listRecordStatus = [];
  displayFrom = false;
  pagingComponent = {
    total: 0
  }

  titleForm = {
    label: 'Thêm mới tài khoản',
    value: 'Add'
  }

  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs: any = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getSalaryRecordPage(queryParams).subscribe(
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
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
        this.FnEvent();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetSalaryRecordPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.pheDuyet.bind(this),
          label: 'Phê duyệt',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetSalaryRecordPage.url, ACTIONS.PHE_DUYET)
        },
        // {
        //   onClick: this.CloseAccount.bind(this),
        //   label: 'Đóng tài khoản',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },
      ]
    };
  }

  pheDuyet(event) {
      this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện phê duyệt?',
      accept: () => {
        this.apiService.setSalaryRecordApprove({ recordId: event.rowData.recordId }).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
            this.load();
            this.FnEvent();
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

  xoaTienLuong(event) {
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn thực hiện mở tài khoản?',
    //   accept: () => {
    //     const queryParams = queryString.stringify({ companyId: event.rowData.companyId });
    //     this.apiService.delCompanyInfo(queryParams).subscribe(results => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
    //         this.load();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  editRow({rowData}) {
    const params = {
      recordId: rowData.recordId
    }
    this.router.navigate(['/chinh-sach/tien-luong/chi-tiet-tien-luong'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  addTienLuong() {
    this.displayFrom = true;
    this.modelAdd = {
      date: new Date(),
    }


    // const params = {
    //   companyId: 0
    // }
    // this.router.navigate(['/tien-luong/them-moi-tien-luong'], { queryParams: params });
  }

  themmoi() {
    console.log(this.modelAdd);
    let data: any = { ...this.modelAdd };
    data.salary_year = new Date(this.modelAdd.date).getFullYear();
    data.salary_month = new Date(this.modelAdd.date).getMonth() + 1;
    delete data.date;
    this.router.navigate(['/chinh-sach/tien-luong/them-moi-tien-luong'], { queryParams: data });
  }

  find() {
    this.load();
    this.FnEvent();
  }

  changePageSize() {
    this.load();
    this.FnEvent();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
    this.FnEvent();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách tiền lương' },
    ];
    // this.getOrgRoots();
    this.getFilter();
  }

  loadjs = 0;
  heightGrid = 0
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

  getOrgRoots() {
    this.apiService.getOrgRoots().subscribe(results => {
      if (results.status === 'success') {
        this.listOrgRoots = results.data.map(d => {
          return {
            label: d.name,
            value: `${d.value}`
          }
        });
        this.listOrgRoots = [{ label: 'Chọn tổ chức', value: null }, ...this.listOrgRoots];
      }
    })
  }

  quanlyloaihopdong() {
    this.router.navigate(['/company/danh-sach-quan-ly-hd']);
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v1/salary/GetSalaryFilter').subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

   filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
  }

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.query = { ...this.query, ...params};
      this.load();
      this.FnEvent();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
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
          this.apiService.getFilter('/api/v1/salary/GetSalaryFilter').subscribe(results => {
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

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addTienLuong()
        });
      }
    }, 300);
  }

}



