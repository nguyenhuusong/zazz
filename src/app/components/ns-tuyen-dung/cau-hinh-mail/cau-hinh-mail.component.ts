import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-cau-hinh-mail',
  templateUrl: './cau-hinh-mail.component.html',
  styleUrls: ['./cau-hinh-mail.component.scss']
})
export class CauHinhMailComponent implements OnInit {
  @Output() idOutPut = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  pagingComponent = {
    total: 0
  };
  gridKey = ''
  displaySetting = false

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
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  modelTM: any = {};
  itemsToolOfGrid: any[] = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    
    private router: Router) {

    }
    query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  load() {
    this.columnDefs = [];
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getRecruitMailPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results?.data?.dataList?.data;
        this.gridKey= results?.data?.dataList?.gridKey;

        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results?.data?.dataList?.recordsTotal;
        this.countRecord.totalRecord = results?.data?.dataList?.recordsTotal;
        this.countRecord.currentRecordStart = results?.data?.dataList?.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
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
          label: 'Xem chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  isFormDetail = false;
  idForm = null;
  editRow({rowData}) {
    this.idForm = rowData.tempId;
    this.isFormDetail = true;
  }

  theEventDetail(event){
    this.isFormDetail = false;
    this.load();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
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
          this.create()
        });
      }
    }, 300);
  }

  create() {
    this.isFormDetail = true;
    this.idForm = null
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
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ tempId: event.rowData.tempId });
        this.apiService.delRecruitMailInfo(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
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
     
    this.load();
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Cấu hình mail' },
    ];
    
  }
  employeeStatus = []
  getEmployeeStatus() {
    this.apiService.getEmployeeStatus()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.employeeStatus = []
        results.data.forEach(s => {
          if (s.value != "3") {
            this.employeeStatus.push({
              label: s.name,
              value: s.value
            })
          }
        }
        )
        this.employeeStatus = [{ label: '---Chọn mã chỉ tiêu---', value: -1 }, ...this.employeeStatus];
      }
    })
  }
 

  exportExel() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeePage(queryParams)
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
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách hồ sơ nhân sự ' + new Date());

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  loadjs = 0;
  heightGrid = 300
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

  backTo() {
    this.router.navigate(['/tuyen-dung/vi-tri-tuyen-dung']);
  }

  cauhinh() {
    this.displaySetting = true;
  }


}