import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-qt-thay-doi-luong',
  templateUrl: './qt-thay-doi-luong.component.html',
  styleUrls: ['./qt-thay-doi-luong.component.scss']
})
export class QtThayDoiLuongComponent implements OnInit {
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
  listsData = [];
  selectedNode
  capaStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Chưa duyệt', value: 0 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 2 },
    { label: 'Khởi tạo', value: null },
  ]
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  isShowAvatar = false;
  imgAvatar = '';
  modelTM: any = {};
  displayEmployee = false;

  // for the move organ
  departmentFiltes = [];
  organizeId = '';
  aDepartment: any;
  theOrganToMoveData = []
  isTheOrganToMove = false;
  queryStaffToMove = {
    organizeId: '',
    orgId: '',
    members: []
  }
  organs = []
  isButtonmoveOrganNow = true;
  itemsToolOfGrid: any[] = [];
  companies = []
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,

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
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 20,
  }

  titleForm = {
    label: 'Thêm mới phòng ban',
    value: 'Add'
  }
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  displayButton = false;
  detailOrganizeMap = null;

  departments = [];

  isHrDiagram: boolean = false

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onmouseenter(event) {
    console.log(event)
  }
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 20,
    }
    this.load();
    this.FnEvent();
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

  selected(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }


  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getSalaryInfoPageNew(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results?.data?.dataList?.data;
          this.gridKey = results?.data?.dataList?.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results?.data?.gridflexs ? results?.data?.gridflexs : [];
            this.colsDetail = results?.data?.gridflexdetails ? results?.data?.gridflexdetails : [];
          }
          this.initGrid();
          this.countRecord.totalRecord = results?.data?.dataList?.recordsTotal;
          this.countRecord.totalRecord = results?.data?.dataList?.recordsTotal;
          this.countRecord.currentRecordStart = results?.data?.dataList?.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
          if ((results?.data?.dataList?.recordsTotal - this.query.offSet) > this.query.pageSize) {
            this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
          } else {
            this.countRecord.currentRecordEnd = results?.data?.dataList?.recordsTotal;
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
          icon: 'pi pi-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetHrmPayrollRecordPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetHrmPayrollRecordPage.url, ACTIONS.DELETE)
        },
      ]
    };
  }
  idEdit = null;
  editRow({ rowData }) {
    const params = {
      salaryInfoId: rowData.salaryInfoId
    }
    this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong/chi-tiet-qua-trinh-thay-doi-luong'], { queryParams: params });
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ salaryInfoId: event.rowData.salaryInfoId });
        this.apiService.delSalaryInfoNew(queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results: any) => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa nhân viên thành công' });
              this.load();
              this.FnEvent();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
      }
    });
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
          this.addNew()
        });
      }
    }, 300);
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'STT',
        filter: '',
        maxWidth: 70,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
            `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right cell-action', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
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
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quan hệ lao động' },
      { label: 'Quá trình thay đổi lương' },
    ];

    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetHrmPayrollRecordPage.url, ACTIONS.IMPORT),
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetHrmPayrollRecordPage.url, ACTIONS.IMPORT),
        command: () => {
          this.exportExel();
        }
      },
    ]
    this.route.queryParams
    .subscribe((params: any) => {
      const apiParam = params;
      if (apiParam) {
        this.query = { ...this.query, ...apiParam };
        this.load();
        this.getSalaryInfoFilter(false);
      } else {
        this.getSalaryInfoFilter(true);
      }
    })


  }
  employeeStatus = []
  getEmployeeStatus() {

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

  exportExel() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.getSalaryInfoPageNew(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          const dataExport = [];
          let gridflexs = results.data.gridflexs;
          let arrKey = gridflexs.map(elementName => elementName.columnField);

          let dataList = results.data.dataList.data;
          for (let elementValue of dataList) {
            const data: any = {};
            for (let elementName of gridflexs) {
              if (arrKey.indexOf(elementName.columnField) > -1 && !elementName.isHide && elementName.columnField !== 'statusName') {
                let valueColumn = elementValue[elementName.columnField];
                if (elementName.columnField == 'status_name' || elementName.columnField == 'isContacted' || elementName.columnField == 'isProfileFull' || elementName.columnField == 'lockName') {
                  valueColumn = this.replaceHtmlToText(valueColumn);
                }
                data[elementName.columnCaption] = valueColumn || '';
              }

            }

            dataExport.push(data);
          }
          this.fileService.exportAsExcelFile(dataExport, 'Danh sách Quá trình thay đổi lương');

          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  showButtons2(params) {
    return {
      buttons: [
        {
          onClick: this.delStaffinDataOraMove.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  delStaffinDataOraMove(data) {
    this.theOrganToMoveData = this.theOrganToMoveData.filter(a => a.CustId != data.rowData.CustId);
    if (this.theOrganToMoveData.length < 1) {
      this.isButtonmoveOrganNow = true
    }
  }


  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
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

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.organizeId });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
    this.queryStaffToMove.orgId = '';
    this.aDepartment = '';
    if (this.organizeId && this.queryStaffToMove.orgId) {
      this.isButtonmoveOrganNow = false;
    }
    else {
      this.isButtonmoveOrganNow = true;
    }
  }

  // handleChangeOrganize() {
  //   this.getOrganizeTree();
  // }
  onChangeTreeDepart(event) {
    this.queryStaffToMove.orgId = event.node.orgId;
    // if(this.organizeId && event.node.orgId){
    //   this.isButtonmoveOrganNow = false;
    // }
    // else {
    //   this.isButtonmoveOrganNow = true;
    // }

    //MS-773
    this.isButtonmoveOrganNow = false;
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

  importFileExel() {
    this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong/import-salary']);
  }
  isSearchEmp: boolean = false
  addNew() {
    this.isSearchEmp = true;
  }

  seachEmValue(event) {
    const params = {
      salaryInfoId: null,
      empId: event.value
    }
    if (event.value) {
      this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong/them-moi-qua-trinh-thay-doi-luong'], { queryParams: params });
    } else {
      this.isSearchEmp = false;
    }
  }

  getCompany() {

  }


  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2  addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2  addNew', icon: 'pi pi-times' },
  ];

  getSalaryInfoFilter(reload: boolean) {
    this.apiService.getSalaryInfoFilter()
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
        }
      });
  }
  filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
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
          this.apiService.getSalaryInfoFilter()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(results => {
              if (results.status === 'success') {
                const listViews = cloneDeep(results.data.group_fields);
                this.listViewsFilter = [...listViews];
                const params = getParamString(listViews)
                this.query = { ...this.query, ...params };
                this.load();
                this.detailInfoFilter = results.data;
                this.showFilter()
              }
            });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.cloneListViewsFilter);
          this.listViewsFilter = cloneDeep(listViews);
          const params = getParamString(listViews)
          this.query = { ...this.query, ...params };
          this.load();
        }
      }
    });
  }
}
