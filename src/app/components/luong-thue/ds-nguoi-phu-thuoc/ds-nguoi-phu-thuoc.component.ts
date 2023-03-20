import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import * as FileSaver from 'file-saver';
const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ds-nguoi-phu-thuoc',
  templateUrl: './ds-nguoi-phu-thuoc.component.html',
  styleUrls: ['./ds-nguoi-phu-thuoc.component.scss']
})
export class DsNguoiPhuThuocComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  constructor(
    private apiService: ApiHrmService,
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
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };

    this.getEmpDependentFilter();
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
  loading = false;
  selectedValue: any = '';
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadjs = 0;
  heightGrid = 0;
  dataRowSelected: any = [];
  optionsButtonDB: any = [];
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 10;
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

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    let params: any = { ... this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getEmpDependentPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey = results.data.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.childgridflexs ? results.data.childgridflexs : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        if (this.query.pageSize === MAX_SIZE) {
          this.query.pageSize = this.countRecord.totalRecord;
        }
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
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
        {
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.getRecruitPlanPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.getRecruitPlanPage.url, ACTIONS.DELETE)
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
          this.create()
        });
      }
    }, 300);
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
        width: 60,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }];
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
          params.successCallback(params.data.dependents);
        },
        excelStyles: [
          {
            id: 'stringType',
            dataType: 'string'
          }
        ],
        template: function (params) {
          var personName = params.data.full_name;
          return (
            '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
            `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.dependents.length}) : [` +
            personName + ']' +
            '</div>' +
            '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
            '</div>'
          );
        },
      };

  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa vị trí tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ dependentId: event.rowData.dependentId });
        this.apiService.delEmpDependent(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa vị trí tuyển dụng thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  editRow({rowData}) {
    const params = {
      dependentId: rowData.dependentId
    }
    this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc/chi-tiet-nguoi-phu-thuoc'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  create() {
   this.isSearchEmp = true;
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }


  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Lương thuế' },
      { label: 'Danh sách người phụ thuộc' },
    ];
    this.optionsButtonDB = [
      {
        label: 'Import người phụ thuộc',
        code: 'import',
        icon: 'fa fa-download',
        // disabled: CheckHideAction(MENUACTIONROLEAPI.getRecruitPlanPage.url, ACTIONS.EXPORT),
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export',
        code: 'export',
        icon: 'fa fa-download',
        // disabled: CheckHideAction(MENUACTIONROLEAPI.getRecruitPlanPage.url, ACTIONS.EXPORT),
        command: () => {
          this.exportExel();
        }
      },
      
    ]
  }

  importFileExel() {
    this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc/import-nguoi-phu-thuoc']);
  }



  exportExel() {
    let params: any = { ... this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.setEmpDependentExport(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else {
        var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `Danh sách người phụ thuộc` + ".xlsx");
        this.spinner.hide();
      }
    })

  }
  

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  getEmpDependentFilter() {
    this.apiService.getEmpDependentFilter()
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
  isSearchEmp = false
  seachEmValue(event) {
    const params = {
      dependentId: null,
      empId: event.value
    }
    if(event.value) {
      this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc/them-moi-nguoi-phu-thuoc'], { queryParams: params });
    }else{
      this.isSearchEmp = false;
    }
  }


}
