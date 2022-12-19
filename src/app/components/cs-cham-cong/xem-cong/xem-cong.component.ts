import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
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
    // this.getOrgRoots();
      // this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
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
    this.apiService.getTimekeepingDetail(queryParams).subscribe(results => {
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
    // this.apiService.getOrgRoots().subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listOrgRoots = results.data.map(d => {
    //       return {
    //         label: d.org_name,
    //         value: `${d.orgId}`
    //       }
    //     });
    //     this.query.orgId = this.listOrgRoots[0].value
    //     this.getXemCongInfo();
    //   }
    // })
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams)
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
    // this.getXemCongInfo();
    this.getOrganizeTree();
  }
  onChangeTree() {
    // this.getXemCongInfo();
  }
  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.organizeIds});
    this.apiService.getOrganizeTree(queryParams)
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
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight +10;
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

  // listOrgRoots = []
  // getOrgRoots() {
  //   this.apiService.getOrgRoots().subscribe(results => {
  //     if (results.status === 'success') {
  //       this.listOrgRoots = results.data.map(d => {
  //         return {
  //           label: d.org_name,
  //           value: `${d.orgId}`
  //         }
  //       });
  //       this.query.orgId = this.listOrgRoots[0].value
  //       this.getXemCongInfo();
  //     }
  //   })
  // }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.columnDefs.filter((d: any) => !d.isHide)),
      // {
      //   headerName: 'Thao tác',
      //   filter: '',
      //   maxWidth: 90,
      //   pinned: 'right',
      //   cellRenderer: 'buttonAgGridComponent',
      //   cellClass: ['border-right', 'no-auto'],
      //   // cellRendererParams: (params: any) => this.showButtons(params),
      //   checkboxSelection: false,
      //   field: 'checkbox'
      // }
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
    this.apiService.exportTimekeeping(queryParams).subscribe(results => {
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



