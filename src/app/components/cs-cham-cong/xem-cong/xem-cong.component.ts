import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-xem-cong',
  templateUrl: './xem-cong.component.html',
  styleUrls: ['./xem-cong.component.scss']
})
export class XemCongComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  optionsButtonsView = [{ label: 'Quay lại', value: 'Cancel', icon: 'pi pi-arrow-left' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef
  ) { }
  listViews = []
  paramsObject = null
  titlePage: string = '';
  url: string = '';
  detailInfo = null;
  listsData = []
  columnDefs: any = []
  cols: any[];
  query = {
    orgId: '',
    filter: '',
    organizeId: '',
    pageSize: 20,
    fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    offSet: 0,
    organizeIds: '',
  }
  departmentFiltes = [];
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  first = 0;

  displaySetting = false;
  gridKey = ''
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  items = [];
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.getOrganizeTree()
    this.getXemCongInfo();
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách chấm công', routerLink: '/chinh-sach/cham-cong' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
  }

  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.getXemCongInfo();
    });
  };

  getXemCongInfo() {
    this.listViews = [];
    this.listsData = [];
    let params: any = {... this.query};
    params.orgId = typeof params.orgId === 'string' ? params.orgId : params.orgId.orgId;
    delete params.fromdate
    delete params.todate
    params.FromDate = moment(new Date(this.query.fromdate)).format('YYYY-MM-DD')
    params.ToDate = moment(new Date(this.query.todate)).format('YYYY-MM-DD')
    const queryParams = queryString.stringify(params);
    this.spinner.show();
    this.apiService.getTimekeepingDetail(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.gridKey= results.data.dataList.gridKey;
        this.spinner.hide();
        this.columnDefs = results.data.gridflexs;
        this.listViews = cloneDeep(results.data.group_fields);
        this.listsData = results.data.dataList.data;
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
      }
    })
  }


  listOrgRoots = []
  getOrgRoots() {
    
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listOrgRoots = results.data
            .map(d => {
              return {
                label: d.organizationName || d.organizationCd,
                value: d.organizeId
              };
            });
            this.getXemCongInfo();
          this.listOrgRoots = [{ label: 'Chọn tổ chức', value: '' }, ...this.listOrgRoots];
        }),
        error => { };
  }

  changeOrgani() {
    this.getOrganizeTree();
  }
  onChangeTree() {
  }
  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.organizeIds});
    this.apiService.getOrganizeTree(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }


  cancel() {
    this.query = {
      orgId: '',
      filter: '',
      organizeId: '',
      pageSize: 20,
      fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
      todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
      offSet: 0,
      organizeIds: this.query.organizeIds,
    }
    this.getXemCongInfo();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows
    this.getXemCongInfo();
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +30;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setCompanyInfo(data) {
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.columnDefs.filter((d: any) => !d.isHide)),
     
    ]
  }

  Export() {
    let params: any = {... this.query};
    params.orgId = typeof params.orgId === 'string' ? params.orgId : params.orgId.orgId;
    delete params.fromdate
    delete params.todate
    params.FromDate = moment(new Date(this.query.fromdate)).format('YYYY-MM-DD')
    params.ToDate = moment(new Date(this.query.todate)).format('YYYY-MM-DD')
    const queryParams = queryString.stringify(params);
    this.spinner.show();
    this.apiService.exportTimekeeping(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else {
        var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `Danh sách xem công tháng ${params.FromDate} - ${params.ToDate}` +".xlsx");
        this.spinner.hide();
      }
    })
  }

  cauhinh() {
    this.displaySetting = true;
  }
}



