import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { HttpParams } from '@angular/common/http';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';

@Component({
  selector: 'app-tham-so-chung-list',
  templateUrl: './tham-so-chung-list.component.html',
  styleUrls: ['./tham-so-chung-list.component.scss']
})
export class ThamSoChungListComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  dataContractTypes: any;
  constructor(
    private apiService: ApiHrmService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
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
  columnDefs;
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
    pageSize: 15,
    gridWidth: 1550,
    mod_cd: null,
    object_key: null,
    orgIds: '',
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  moduleTypes = [];
  objectTypes = [];
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
      gridWidth: 1550,
      mod_cd: null,
      object_key: null,
      orgIds: localStorage.getItem("organizes")
    }
    this.load();
  }
  loadjs = 0;
  heightGrid = 0;
  listsData = [];

  ngOnInit() {
    this.query.orgIds = localStorage.getItem("organizes");
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.orgIds = results;
          this.load();
        }
    });
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Tham số chung' },
    ];
    this.getObjectTypes();
    this.getModuleTypes();
    this.load();
  }

  getObjectTypes(): void {
    const opts1 = { params: new HttpParams({ fromString: `objKey=object_type` }) };
    this.apiService.getCustObjectListNew(true, opts1.params.toString()).subscribe(results => {
      this.objectTypes = results.data.map(d => {
        return {
          label: d.objName,
          value: d.objValue
        }
      });
    });
  }

  getModuleTypes(): void {
    const opts1 = { params: new HttpParams({ fromString: `objKey=module_type` }) };
    this.apiService.getCustObjectListNew(true, opts1.params.toString()).subscribe(results => {
      this.moduleTypes = results.data.map(d => {
        return {
          label: d.objName,
          value: d.objValue
        }
      });
    });
  }

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
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
    this.apiService.getParameterPage(queryParams)
    .subscribe(
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
          onClick: this.handleEdit.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetParameterPage.url, ACTIONS.VIEW)
        },
        // {
        //   onClick: this.handleDelete.bind(this),
        //   label: 'Xóa',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },

      ]
    };
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

  handleDelete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa hợp đồng?',
      accept: () => {
        // const queryParams = queryString.stringify({ contractTypeId: event.rowData.contractTypeId });
        // this.apiService.delContractTypeInfo(queryParams).subscribe(results => {
        //   if (results.status === 'success') {
        //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa hợp đồng thành công' });
        //     this.load();
        //   } else {
        //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        //   }
        // });
      }
    });
  }

  handleEdit(event) {
    this.router.navigate([`/cai-dat/tham-so-chung/${event.rowData.id}`]);
  }


  handleAdd() {
    this.router.navigate(['/cai-dat/tham-so-chung/null']);
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

  sizeToFit() {
    if (this.gridApi) {
      let allColumnIds: any = [];
      this.gridColumnApi.getAllColumns()
        .forEach((column: any) => {
          if (column.colDef.cellClass.indexOf('no-auto') < 0) {
            allColumnIds.push(column)
          } else {
            column.colDef.suppressSizeToFit = true;
            allColumnIds.push(column)
          }
        });
      this.gridApi.sizeColumnsToFit(allColumnIds);
    }
  }

  autoSizeAll() {
    if (this.gridColumnApi) {
      if (this.gridColumnApi.columnModel.bodyWidth < this.gridColumnApi.columnModel.scrollWidth) {
        this.sizeToFit();
      } else {
        let allColumnIds: any = [];
        this.gridColumnApi.getAllColumns()
          .forEach((column: any) => {
            if (column.colDef.cellClass.indexOf('no-auto') < 0) {
              allColumnIds.push(column)
            }
          });
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      }
    }
  }
}