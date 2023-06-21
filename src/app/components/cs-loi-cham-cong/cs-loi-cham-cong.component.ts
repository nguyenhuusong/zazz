import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction, updateValueFilterFromUrl } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cs-loi-cham-cong',
  templateUrl: './cs-loi-cham-cong.component.html',
  styleUrls: ['./cs-loi-cham-cong.component.scss']
})
export class CsLoiChamCongComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  pinnedBottomData: any[] = [];
  items = []
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private changeDetector: ChangeDetectorRef,

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
  apiParam = null;

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  pagingComponent = {
    total: 0
  }
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
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
  loading = false;
  listVacancy = []
  companies = [];
  queryDetail = {
    recordId: '',
    empId: '',
    work_date: '',
    timekeepingId: ''
  }
  isDetail = false;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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

  load(isSearch = false) {
    if(this.apiParam && !isSearch) {
      this.query = { ...this.query, ...this.apiParam}
    }
    this.columnDefs = []
    // this.spinner.show();
    const params: any = { ...this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getTimekeepingFailPage(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList;
          this.gridKey = results.data.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
            this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
          }
          this.initGrid();
          this.countRecord.totalRecord = results.data.recordsTotal;
          this.countRecord.totalRecord = results.data.recordsTotal;
          // if(results.data.dataList.length > 0) {
          //  const keyAll= Object.keys(results.data.dataList[0]);
          //  const keySum= Object.keys(results.data.keepingSum);
          //  const keepingSum = {};
          //  for(let item of keyAll) {
          //   keepingSum[item] = '';
          //     if(keySum.indexOf(item) > -1) {
          //       keepingSum[item] = results.data.keepingSum[item]
          //     }
          //  }
          //  console.log(keepingSum)
          //   this.pinnedBottomData = [keepingSum];
          // }
          this.pinnedBottomData = [results.data.keepingSum]
          this.countRecord.currentRecordStart = results.data.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
          if ((results.data.recordsTotal - this.query.offSet) > this.query.pageSize) {
            this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
          } else {
            this.countRecord.currentRecordEnd = results.data.recordsTotal;
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
        {
          onClick: this.editRow.bind(this),
          label: 'Xem',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.leaveExplan.bind(this),
          label: 'Giải trình công',
          icon: 'uni-icon uni-pen-line',
          class: 'btn-primary mr5',
        },
      ]
    };
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
          this.addThaiSan()
        });
      }
    }, 300);
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.Owns);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.Owns.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }
  showGiaiTrinh = false;
  leaveExplan({rowData}) {
    this.queryDetail.timekeepingId = rowData.timekeepingId;
    this.showGiaiTrinh = true;

  }
  
  editRow({ rowData }) {
    this.isDetail = true;
    this.queryDetail.empId = rowData.empId;
    this.queryDetail.recordId = rowData.recordId;
    this.queryDetail.work_date = rowData.work_dt;
  }

  callback() {
    this.isDetail = false;
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  isSearchEmp = false;
  addThaiSan() {
    this.isSearchEmp = true;

    // const params = {
    //   maternityId: null
    // }
    // this.router.navigate(['/nhan-su/thai-san/them-moi-thai-san'], { queryParams: params });
  }

  find() {
    this.load();
    this.FnEvent();
  }

  changePageSize() {
    this.load();
    this.FnEvent();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.find();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chấm công' },
      { label: 'Lỗi chấm công' },
    ];
    this.route.queryParams
      .subscribe((params: any) => {
        const apiParam = params;
        if (Object.keys(apiParam).length > 0) {
          this.query = { ...this.query, ...apiParam };
          this.apiParam = apiParam
          this.load();
          this.getEmpFilter(false);
        } else {
          this.getEmpFilter(true);
        }
      })

  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2  addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger  addNew', icon: 'pi pi-times' },
  ];
  
  getEmpFilter(reload: boolean) {
    this.apiService.getFilter('/api/v1/timekeeping/GetTimekeepingFilter')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.cloneListViewsFilter = cloneDeep(listViews);
          this.listViewsFilter = [...listViews];
          const params = getParamString(listViews)
          this.query = { ...this.query, ...params };
          if(reload) this.load();
          this.detailInfoFilter = results.data;

          const groupFields = updateValueFilterFromUrl(listViews, this.apiParam);
          this.detailInfoFilter = { ...this.detailInfoFilter, group_fields: groupFields };
          this.listViewsFilter = [...groupFields];
        }
      });
  }
  filterLoad(event) {
this.listViewsFilter =  cloneDeep(event.listViewsFilter);
    this.query = { ...this.query, ...event.data };
    this.load(true);
    this.FnEvent();
  }

  close({ event, datas }) {
    if (event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params = getParamString(listViews)
      this.query = { ...this.query, ...params };
      this.load();
    } else {
      this.listViewsFilter = cloneDeep(datas);
    }
  }

  seachEmValue(event) {
    const params = {
      maternityId: null,
      empId: event.value
    }
    if (event.value) {
      this.router.navigate(['/nhan-su/thai-san/them-moi-thai-san'], { queryParams: params });
    } else {
      this.isSearchEmp = false;
    }
  }

}


