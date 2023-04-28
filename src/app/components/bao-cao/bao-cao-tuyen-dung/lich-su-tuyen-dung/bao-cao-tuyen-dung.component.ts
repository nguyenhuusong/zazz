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
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { getParamString, replaceQueryReport } from 'src/app/common/function-common/objects.helper';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-bao-cao-tuyen-dung',
  templateUrl: './bao-cao-tuyen-dung.component.html',
  styleUrls: ['./bao-cao-tuyen-dung.component.scss']
})
export class BaoCaoTuyenDungComponent implements OnInit {

  listsData: any[] = [];
  items = []
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  gridflexs: any;
  getRowHeight;
  query: any = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    report_type: 1
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  apiUrl = '';
  reportTypeValue = '';
  reportTypeValues = null;
  dataReportTypeValue: any = [];
  dataFilter: any = null;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  loadjs = 0;
  heightGrid = 450;

  // the value for check disabled 'Chuyển vòng radio'

  // ngAfterViewChecked(): void {
  //   const a: any = document.querySelector(".header");
  //   const b: any = document.querySelector(".sidebarBody");
  //   const d: any = document.querySelector(".bread-crumb");
  //   const e: any = document.querySelector(".paginator");
  //   this.loadjs++
  //   if (this.loadjs === 5) {
  //     if (b && b.clientHeight) {
  //       const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
  //       this.heightGrid = window.innerHeight - totalHeight
  //       this.changeDetector.detectChanges();
  //     } else {
  //       this.loadjs = 0;
  //     }
  //   }
  // }

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

  getReportList() {
    const queryParams = queryString.stringify(this.query);
    this.apiService.getReportList(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.dataReportTypeValue = results.data;
        if(results.status === 'success'){
          this.reportTypeValues = results.data.map( d => {
            return {
              label: d.report_name,
              value: d.report_id
            }
          })
        }
      }
    ,
    error => {
      this.spinner.hide();
    });
  }

  changeReportTypeValue(event) {
    let dataSelected = this.dataReportTypeValue.filter( d => parseInt(d.report_id) === parseInt(this.reportTypeValue))
    if(dataSelected.length > 0) {
      this.apiUrl = dataSelected[0].api_url;
      this.dataFilter = dataSelected[0].paramaters
    }
  }

  theQueryUpdated(queryData){
    this.spinner.show();
    let params: any = {}
    if(queryData.query) {
      queryData.query.forEach((field: any) => {
        params[field.param_cd] = field.param_default
      });
      const queryParams = replaceQueryReport(params);
      this.apiService.getDataReport(this.apiUrl, queryString.stringify(queryParams))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.spinner.hide();
          console.log('results', results)
      },
      error => {
        this.spinner.hide();
      });
    }

  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getReportList(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        // this.listsData = results.data.dataList.data;
        // this.gridKey= results.data.dataList.gridKey;
        // if (this.query.offSet === 0) {
        //   this.cols = results.data.gridflexs;
        //   this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        // }
        // this.initGrid();
        // this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        // this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        // this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        // if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
        //   this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        // } else {
        //   this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        //   setTimeout(() => {
        //     const noData = document.querySelector('.ag-overlay-no-rows-center');
        //     if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
        //   }, 100);
        // }
        // this.spinner.hide();
      },
      error => {
        // this.spinner.hide();
      });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
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

    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Báo cáo' },
      { label: 'Tuyển dụng', routerLink: '/bao-cao/tuyen-dung' },
      { label: 'Báo cáo tuyển dụng' },
    ];
    this.getReportList();
    // this.load();
  }


}


