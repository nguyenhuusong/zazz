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
  heightGrid = 550;

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    console.log("ádasdasd")
    this.displaySetting = true;
  }
  reportTypeValue = null;
  dataReportTypeValue = [];
  reportTypeValues = [];
  getReportList() {
    const queryParams = queryString.stringify(this.query);
    this.apiService.getReportList(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          if (results.status === 'success') {
            this.dataReportTypeValue = cloneDeep(results.data);
            this.reportTypeValues = results.data.map(d => {
              return {
                label: d.report_name,
                value: d.int_order
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
    { label: 'Hiển thị', value: 'ViewReport', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Mở tệp', value: 'OpenReport', class: 'p-button-sm p-button-success ml-2 height-56 addNew', icon: 'pi pi-clone' },
    { label: 'Lưu tệp', value: 'DowloadReport', class: 'p-button-sm p-button-success ml-2 height-56 addNew', icon: 'pi pi-cloud-download' },
  ];

  changeReportTypeValue(event) {
    this.listViewsReport = [];
    this.columnDefs = [];
    this.isShowLists = false;
    let dataSelected = this.dataReportTypeValue.filter(d => parseInt(d.int_order) === parseInt(this.reportTypeValue))
    if (dataSelected.length > 0) {
      this.detailInfoReport = dataSelected[0];
      this.listViewsReport = dataSelected[0].group_fields;
    }
  }

  geFilter() {
    this.apiService.getFilter('/api/v2/empinsurance/GetInsuranceFilter')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViewsReport = [...listViews];
          this.detailInfoReport = results.data;
        }
      });
  }

  paginate(event): void {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }


  load() {
    this.columnDefs = []
    this.spinner.show();
    const params: any = { ... this.query };
    delete params.type;
    const queryParams = queryString.stringify(params);
    this.apiService.getReportAll(this.detailInfoReport.api_url_view, queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList;
        this.gridKey= results.data.gridKey;
        this.isGridTree = results.data.gridType === 1 ? true : false;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.childgridflexs ? results.data.childgridflexs : [];
        }
        if(this.isGridTree) {
          this.initGridTree(results.data.treeName);
        }else {
          this.initGrid();
        }
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.currentRecordStart = results.data.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.recordsTotal - this.query.offSet) > this.query.pageSize) {
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

  loadExport(queryParams: any, type: string) {
    this.spinner.show();
    this.apiService.getDataReport(this.detailInfoReport.api_url_dowload, queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        if(type === 'open') {
          if(results.data && results.data.webViewLink){
            window.open(results.data.webViewLink);
            this.spinner.hide();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xuất báo cáo bị lỗi' });
            this.spinner.hide();
          }
        }else {
          if(results.data && results.data.webContentLink){
            window.open(results.data.webContentLink);
            this.spinner.hide();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xuất báo cáo bị lỗi' });
            this.spinner.hide();
          }
        }
      
      },
      error => {
        this.spinner.hide();
      });
  }

  initGrid() {
    console.log("sddddddđ")
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
  }

  autoGroupColumnDef:any = null;
  getDataPath: any = null;
  isGridTree = false;
  initGridTree(treeName: string) {
 
    this.autoGroupColumnDef = {
      headerName: treeName,
      cellClass: [ 'no-auto'],
      // cellClass: parmas => parmas.node.level > 0  ?  ['hidden'] : [''],
     minWidth: 400,
      cellRendererParams: {
        suppressCount: true,
      },
    }
    this.getDataPath = (data) => {
      return data.orgHierarchy;
    };
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
    ];
  }
  listsDataChilren = [];
  org_name = [];
  displaydetailChilren = false;
  onCellClicked(event) {
    console.log(event)
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.listsDataChilren = event.data.children;
      this.org_name = event.data.org_name;
      this.displaydetailChilren = true;
    } 
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
    this.getReportList();
  }
  isShowLists: boolean = false;
  getReport(event) {
    if(event.type === "ViewReport") {
      this.isShowLists = true;
      this.query = {...this.query, ...event.data}
      this.load();
    }else if(event.type === "OpenReport") {
      this.isShowLists = true;
      const queryParams = queryString.stringify({ ...event.data });
      this.loadExport(queryParams, 'open');
    }else {
      // this.isShowLists = false;
      const queryParams = queryString.stringify({ ...event.data });
      this.loadExport(queryParams, 'dowload');
    }
  
  }


}

