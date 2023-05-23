import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
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
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { forkJoin, fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-thiet-bi-wifi-cham-cong',
  templateUrl: './thiet-bi-wifi-cham-cong.component.html',
  styleUrls: ['./thiet-bi-wifi-cham-cong.component.scss']
})
export class ThietBiWifiChamCongComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  dataContractTypes: any;
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
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
  columnDefs = [];
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

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 30;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  listsData = [];
  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getEmpDevicePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey = results.data.dataList.gridKey;
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
        this.FnEvent();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        // {
        //   onClick: this.editRow.bind(this),
        //   label: 'Xem chi tiết',
        //   icon: 'fa fa-eye',
        //   class: 'btn-primary mr5',
        //   // hide: CheckHideAction(MENUACTIONROLEAPI.GetContractTypePage.url, ACTIONS.VIEW)
        // },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetContractTypePage.url, ACTIONS.DELETE)
        },

      ]
    };
  }
  listDataSelect = [];
  rowSelected(data) {
    this.listDataSelect = data
  }

  saveApproved() {
    if(this.listDataSelect.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa chọn bản ghi nào !' });
      return;
    }
    let listAPis = []
      for (let item of this.listDataSelect) {
        const dataSave = {
          device_id: item.device_id,
          request_st: 1,
        };
        listAPis.push(this.apiService.setEmpDeviceStatus(dataSave))
      }
      this.spinner.show()
      forkJoin(listAPis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Duyệt thành công' });
        this.spinner.hide();
        this.load();
      })
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: '',
        maxWidth: 90,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        suppressSizeToFit: false,
        field: 'checkbox2',
        showDisabledCheckboxes: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      // {
      //   headerComponentParams: {
      //     template:
      //       `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
      //   },
      //   filter: '',
      //   width: 100,
      //   pinned: 'right',
      //   cellRenderer: 'buttonAgGridComponent',
      //   cellClass: ['border-right', 'no-auto'],
      //   cellRendererParams: (params: any) => this.showButtons(params),
      //   checkboxSelection: false,
      //   field: 'checkbox'
      // }
    ]
  }

  delRow() {
    if(this.listDataSelect.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa chọn bản ghi nào !' });
      return;
    }
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({ devices: this.listDataSelect.map(d => d.device_id) });
        this.apiService.delEmpDevices(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.load();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  editRow({ rowData }) {
    const params = {
      processId: rowData.processId,
    }
    this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac/chi-tiet-xu-ly-qua-trinh-cong-tac'], { queryParams: params });
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }


  addHopDong() {
    this.isSearchEmp = true;
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
  menuItemUtil = [];
  ngOnInit() {
    this.getFilter();
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chấm công' },
      { label: 'Thiết bị wifi chấm công' },
    ];
    
  }

  handleParams() {
  
  };

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm  addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger  addNew', icon: 'pi pi-times' },
  ];
  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v2/empother/GetEmpDeviceFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params = getParamString(listViews)
        this.query = { ...this.query, ...params };
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
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addHopDong()
        });
      }
    }, 300);
  }

  isSearchEmp = false
  seachEmValue(event) {
    const params = {
      processId: null,
      empId: event.value
    }
    if(event.value) {
      this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac/them-moi-xu-ly-qua-trinh-cong-tac'], { queryParams: params });
    }else{
      this.isSearchEmp = false;
    }
  }

}



