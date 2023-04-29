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
  frameworkComponents;
  gridApi: any;
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

  loadjs = 0;
  heightGrid = 450;
  
  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }
  reportTypeValue= null;
  dataReportTypeValue = [];
  reportTypeValues = [];
  getReportList() {
    const queryParams = queryString.stringify(this.query);
    this.apiService.getReportList(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        if(results.status === 'success'){
          this.dataReportTypeValue = cloneDeep(results.data);
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
  detailInfoReport = null;
  listViewsReport = [];
  optionsButonReport = [
    { label: 'Xem trước', value: 'ViewReport', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Export', value: 'ExportReport', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  changeReportTypeValue(event) {
    this.listViewsReport = [];
    let dataSelected = this.dataReportTypeValue.filter( d => parseInt(d.report_id) === parseInt(this.reportTypeValue))
    if(dataSelected.length > 0) {
      this.detailInfoReport = dataSelected[0];
      this.listViewsReport = dataSelected[0].group_fields;
    }
  }

  geFilter() {
    this.apiService.getFilter('/api/v2/empinsurance/GetInsuranceFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViewsReport = [...listViews];
        this.detailInfoReport = results.data;
      }
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
}

  load(queryParams) {
    this.columnDefs = []
    this.spinner.show();
    this.apiService.getReportAll(this.detailInfoReport.api_url_dowload, queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {

        if(results.status === 'success') {
          this.goToLink(results.webViewLink);
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thành công!' });
        }else {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Thất bại !' });
        }
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
  dataRouter: any = null;
  ngOnInit() {
    this.dataRouter = this.route.data['_value'];
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Báo cáo' },
      { label: `${this.dataRouter.title}` },
    ];
    this.query.report_type = this.dataRouter.type;
    this.getReportList();
  }

  close(event) {

  }

  getReport(event) {
    const queryParams = queryString.stringify({...event.data});
    this.load(queryParams);
  }


}


