  import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
  import queryString from 'query-string';
  import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
  import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
  import { NgxSpinnerService } from 'ngx-spinner';
  import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
  import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
  import { ExportFileService } from 'src/app/services/export-file.service';
  import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { fromEvent, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
  @Component({
    selector: 'app-vong-tuyen-dung',
    templateUrl: './vong-tuyen-dung.component.html',
    styleUrls: ['./vong-tuyen-dung.component.scss']
  })
  export class VongTuyenDungComponent implements OnInit {
    @Output() idOutPut = new EventEmitter<any>();
    @Output() add = new EventEmitter<any>();
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
    gridApi: any;
    clientWidth: any;
    gridColumnApi: any;
    objectAction: any;
    objectActionDetail: any;
    gridflexs: any;
    listsData = [];
    totalRecord = 0;
    first = 0;
    gridKey = ''
  displaySetting = false
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
    countRecord: any = {
      totalRecord: 0,
      currentRecordStart: 0,
      currentRecordEnd: 0
    }
    constructor(
      private apiService: ApiHrmService,
      private spinner: NgxSpinnerService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private fileService: ExportFileService,
      private router: Router,
      private changeDetector: ChangeDetectorRef,) {
  
      }
    query = {
      organizeId: '',
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 20,
      organizeIds: '',
    }
  
    cancel() {
      this.query = {
        organizeId: this.query.organizeIds,
        filter: '',
        gridWidth: 0,
        offSet: 0,
        pageSize: 20,
        organizeIds: this.query.organizeIds
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
      this.apiService.getRecruitRoundPage(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList.data;
          this.gridKey= results.data.dataList.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
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

    create() {
      this.isFormDetail = true;
      this.idForm = null
    }
  
    showButtons(event: any) {
      return {
        buttons: [
          {
            onClick: this.editRow.bind(this),
            label: 'Xem chi tiết',
            icon: 'pi pi-tablet',
            class: 'btn-primary mr5',
            // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.VIEW_TINH_LUONG_CAP_BAC_LUONG)
          },
          {
            onClick: this.delRow.bind(this),
            label: 'Xóa',
            icon: 'fa fa-trash',
            class: 'btn-primary mr5',
            // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_CAP_BAC_LUONG)
          },
        ]
      };
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
  
    initGrid() {
      this.columnDefs = [
        ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
        {
          filter: '',
          width: 100,
          pinned: 'right',
          cellRenderer: 'buttonAgGridComponent',
          cellClass: ['border-right', 'no-auto'],
          cellRendererParams: (params: any) => this.showButtons(params),
          checkboxSelection: false,
          field: ''
        }]
    }
  
    delRow(event) {
      this.confirmationService.confirm({
        message: 'Bạn có chắc chắn muốn xóa?',
        accept: () => {
          const query = queryString.stringify({roundId: event.rowData.Id})
          this.apiService.delRecruitRoundInfo(query)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results: any) => {
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
      { label: 'Vòng tuyển dụng' },
    ];
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
          const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 30;
          this.heightGrid = window.innerHeight - totalHeight
          this.changeDetector.detectChanges();
        } else {
          this.loadjs = 0;
        }
      }
    }
    cauhinh() {
      this.displaySetting = true;
    }

  isFormDetail = false;
  idForm = null;

  editRow({rowData}) {
    this.idForm = rowData.Id;
    this.isFormDetail = true;
  }

  theEventDetail(event){
    this.isFormDetail = false;
    this.load();
  }

  backTo() {
    this.router.navigate(['/tuyen-dung/vi-tri-tuyen-dung']);
  }
  tabIndex = 0
  handleChange(index) {
    this.tabIndex = index;
  }
  isFormDetailJsplumb : boolean = false;
  settingJsplumb() {
    this.isFormDetailJsplumb = true;
      setTimeout(() => {
        this.fillFromJson();
      }, 500);

  }

  nodes = [];

  connections = [];
  fillFromJson() {
    const json = `{"nodes":[{"id":"Step id_863206","title":"TODO","type":"","top":279,"left":46},{"id":"Step id_744b6b","title":"UN-DO","type":"","top":104,"left":691},{"id":"Step id_67beea","title":"IN PROGRESS","type":"","top":435,"left":325},{"id":"Step id_b28216","title":"REOPENED","type":"","top":681,"left":317},{"id":"Step id_2429ed","title":"RESOLVED","type":"","top":439,"left":1035},{"id":"Step id_6a3b13","title":"IN-REVIEW","type":"","top":437,"left":661},{"id":"Step id_3dd5f5","title":"DONE","type":"","top":443,"left":1310}],"connections":[{"uuids":["Step id_744b6b_bottom","Step id_863206_TopLeft"]},{"uuids":["Step id_744b6b_bottom","Step id_67beea_TopLeft"]},{"uuids":["Step id_67beea_Top","Step id_6a3b13_Left"]},{"uuids":["Step id_67beea_Top","Step id_2429ed_TopLeft"]},{"uuids":["Step id_2429ed_Top","Step id_3dd5f5_TopLeft"]},{"uuids":["Step id_3dd5f5_bottom","Step id_2429ed_BottomLeft"]},{"uuids":["Step id_2429ed_bottom","Step id_b28216_Right"]},{"uuids":["Step id_b28216_Top","Step id_67beea_BottomLeft"]},{"uuids":["Step id_6a3b13_BottomRight","Step id_2429ed_Left"]}]}`;
    const data = JSON.parse(json);
    this.nodes = data.nodes;
    console.log(this.nodes )

    this.connections = data.connections;
  }
  
  
  }



  
  