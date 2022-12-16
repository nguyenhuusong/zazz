import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import * as queryString from 'querystring';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { DialogService } from 'primeng/dynamicdialog';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-ngay-nghi-le',
  templateUrl: './ngay-nghi-le.component.html',
  styleUrls: ['./ngay-nghi-le.component.scss']
})
export class NgayNghiLeComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  excelStyles = [
    {
      id: 'stringType',
      dataType: 'string'
    },
    {
      id: 'dateType',
      dataType: 'dateTime'
    },
    {
      id: 'numberType',
      dataType: 'number'
    }
  ];
  pagingComponent = {
    total: 0
  };
  projects = []
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
  listsData = null;
  selectedNode
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  // for the move organ
  departmentFiltes = [];
  years = [
    { label: '2020', value: 2020 },
    { label: '2021', value: 2021 },
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
  ]
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    public dialogService: DialogService,
    private router: Router) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      tooltipComponentParams: { color: '#ececec' },
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 50;
    };
    this.frameworkComponents = {
    };


  }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
    OrganizeId: null,
    DepartmentId: null,
    HoliType: null,
    HoliWorkType: null,
    Year: 2022,
    organizeIds: '',
  }
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  detailOrganizeMap = null;
  employeeStatus = []
  onmouseenter(event) {
    console.log(event)
  }
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      OrganizeId: this.query.OrganizeId,
      DepartmentId: null,
      HoliType: null,
      HoliWorkType: null,
      Year: 2022,
      organizeIds: this.query.organizeIds
    }
    this.load();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  expanded(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
      }
      d.children.forEach((elm: { children: { expanded: boolean; }[]; expanded: boolean; }) => {
        elm.children.forEach((e: { expanded: boolean; }) => {
          if (e.expanded === true) {
            elm.expanded = true
          }
        })
      });
    })
    return datas
  }


  themmoingaynghi() {
    const params = {
      id: 0
    }
    this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le/them-moi-ngay-nghi'], { queryParams: params });
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
    this.apiService.holidayPage(queryParams).subscribe(
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
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.EditEmployee.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.HolidayPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.xoanhanvien.bind(this),
          label: 'Xóa',
          icon: 'icon-delete',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.HolidayPage.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'Stt',
        filter: '',
        maxWidth: 140,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
            `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        field: 'button',
        editable: false, width: 100,
        cellRenderer: 'buttonRendererComponent',
        cellRendererParams: (params: any) => this.showButtons(params),
        cellClass: ['action', 'border-right', 'no-auto'],
      },
    ]

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
        params.successCallback(params.data.AgencyGenerals);
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
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.AgencyGenerals.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  xoanhanvien(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ id: event.rowData.id });
        this.apiService.deleteHoliday(queryParams).subscribe((results: any) => {
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

  EditEmployee(event) {
    const params = {
      id: event.rowData.id
    }
    this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le/chi-tiet-ngay-nghi'], { queryParams: params });
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

  ngOnInit() {
    this.getFilter();
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách ngày nghỉ' },
    ];
  }

  organizeList = []
  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    localStorage.setItem('organize', JSON.stringify(event.node));
    this.query.OrganizeId = this.detailOrganizeMap?.orgId;
    this.load()
  }

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }

  exportGrid() {
    this.gridApi.exportDataAsExcel();
  }

  getContextMenuItems(params) {
    var result = [
      'copy',
      'paste',
      'separator',
    ];
    return result;
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  organs = []
  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organs = results.data.map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        this.organs = [...this.organs];
      }
    })
  }

  listDataSelect = [];
  rowSelected(data) {
    this.listDataSelect = data
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }
  //filter 
  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  
  getFilter() {
    this.apiService.getFilter('/api/v1/holiday/GetHolidayFilter').subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.detailInfoFilter = results.data;
        this.load();
      }
    });

  }

  filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
    this.FnEvent();
  }

  closeFilter(event) {
    const listViews = cloneDeep(this.cloneListViewsFilter);
    this.listViewsFilter = cloneDeep(listViews);
    const params = getParamString(listViews)
    this.query = { ...this.query, ...params };
    this.load();
    this.FnEvent()
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
          this.themmoingaynghi()
        });
      }
    }, 300);
  }
}
