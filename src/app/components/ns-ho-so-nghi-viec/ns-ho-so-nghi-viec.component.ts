import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpParams } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-ns-ho-so-nghi-viec',
  templateUrl: './ns-ho-so-nghi-viec.component.html',
  styleUrls: ['./ns-ho-so-nghi-viec.component.scss']
})
export class NsHoSoNghiViecComponent implements OnInit {
  pagingComponent = {
    total: 0
  };
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

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
  dataEmployee = null;
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  isShowAvatar = false;
  imgAvatar = '';
  departmentFiltes = [];
  department = null;
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    
    private router: Router) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
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
    offSet: 0,
    pageSize: 20,
  }
  employeeStatus = []
  isHrDiagram: boolean = false

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }

  getAgencyOrganizeMap() {
    // this.apiService.getAgencyOrganizeMap().subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listAgencyMap = [...results.data.root];
    //     if (localStorage.getItem("organize") === null) {
    //       this.selectedNode = this.listAgencyMap[0];
    //       localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
    //       this.query.orgId = this.selectedNode.orgId;
    //       this.load();
    //     } else {
    //       this.selectedNode = JSON.parse(localStorage.getItem("organize"));
    //       this.query.orgId = this.selectedNode.orgId;
    //       this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parentId)
    //       this.selected(this.listAgencyMap, this.query.orgId)
    //       this.load();
    //     }
    //   }
    // })
  }
  listAgencyMap: TreeNode[];
  selectedNode
  expanded(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
      }
    })
    return datas
  }

  selected(datas = [], orgId = "") {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        this.selectedNode = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }
  detailOrganizeMap = null;
  organizeList = []
  onNodeSelect(event) {
    // this.detailOrganizeMap = event.node;
    // this.query.orgId = this.detailOrganizeMap.orgId;
    // this.isHrDiagram = false;
    // this.load()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = []
  load() {
    this.columnDefs = []
    // this.spinner.show();
    let params: any = {... this.query};
    const queryParams = queryString.stringify(params);
    this.apiService.getTerminatePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
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

  getOrganizeTree(): void {
    // const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
    // this.apiService.getOrganizeTree(queryParams)
    //   .subscribe((results: any) => {
    //     if (results && results.status === 'success') {
    //       this.departmentFiltes = results.data;
    //     }
    //   },
    //     error => { });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetTerminatePage.url, ACTIONS.VIEW)

        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetTerminatePage.url, ACTIONS.DELETE)
        },
        // {
        //   onClick: this.tuyenDungLai.bind(this),
        //   label: 'Tuyển dụng lại',
        //   icon: 'fa fa-edit',
        //   class: 'btn-primary mr5',
        //   hide: CheckHideAction(MENUACTIONROLEAPI.GetTerminatePage.url, ACTIONS.TUYEN_DUNG_LAI)
        // },
        // {
        //   onClick: this.changeStatus.bind(this),
        //   label: 'Thay đổi trạng thái',
        //   icon: 'fa fa-check',
        //   class: 'btn-primary mr5',
        //   hide: CheckHideAction(MENUACTIONROLEAPI.GetTerminatePage.url, ACTIONS.CAP_NHAT_TT)
        // },
      ]
    };
  }

  listViews = [];
  displayDialog = false;
  detailInfoEmployee = null;
  tuyenDungLai(event) {
    const queryParams = queryString.stringify({ empId: event.rowData.empId });
    this.apiService.getEmployeeData('GetEmployeeByJob', queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfoEmployee = results.data;
        this.displayDialog = true;
        this.modelDuyet = {
          workDt: new Date(),
          comments: "",
          full_name: event.rowData.full_name,
        }
      }
    }), error => {
      this.spinner.hide();
    };
  }
  modelDuyet = {
    workDt: new Date(),
    comments: "",
    full_name: "",
  }

  xacNhanTuyenDungLai(data) {
    let params = {
      ...this.detailInfoEmployee, group_fields: data, workDt: moment(new Date(this.modelDuyet.workDt)).format('DD/MM/YYYY'),comments: this.modelDuyet.comments
    }
    this.apiService.setEmployeeRehired(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận tuyển dụng lại thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }), error => {
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        maxWidth: 50,
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
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

  listDataSelect = [];
  rowSelected(data) {
    this.listDataSelect = data
  }

  approved() {
    if(this.listDataSelect.length === 0) {
      this.messageService.add({
        severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa chọn bản ghi nào !. Vui lòng chọn 1 bản ghi.'
      });
      return
    }
    const params = {
      gIds: this.listDataSelect.map(d => {
        return {
          gd: d.terminateId
        }
      }),
      status: 1,
      comment: ''
    }
    this.apiService.setTerminateApproves(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thay đổi trạng thái thành công' });
        this.load();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    });

  }

  editRow({rowData}) {
    const params = {
      empId: rowData.empId,
      terminateId: rowData.terminateId
    }
    this.router.navigate(['/nhan-su/ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec'], { queryParams: params });
  }

  onCellClicked(event) {
    if (event.column.colId == "avatar_url") {
      this.isShowAvatar = true;
      this.imgAvatar = event.value;
    }else {
      if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
        this.editRow(event = {rowData: event.data})
      }
    }
    
  }

  displayChangeStatus = false;
  modelPheDuyet = {
    id: '',
    status_key: '',
    status: 1,
    comment: '',
    status_dt: new Date()
  }
  listTerminateKey = [];
  // listStatus = [
  //   { label: 'Đồng ý', value: 1 },
  //   { label: 'Không đồng ý', value: 0 },
  // ]
  changeStatus(event) {
    this.modelPheDuyet = {
      id: event.rowData.terminateId,
      status_key: this.listTerminateKey.length > 0 ? this.listTerminateKey[0].value : '',
      status: 1,
      comment: '',
      status_dt: new Date()
    }
    this.displayChangeStatus = true;
  }

  xacnhan() {
    this.spinner.show();
    const params: any = { ...this.modelPheDuyet };
    params.lst_status_key = [];
    if(typeof params.status_key === 'object'){
      params.lst_status_key = params.status_key.map(d => d.code);
    }
    delete params.status;
    delete params.status_key;
    params.status_dt = moment(new Date(this.modelPheDuyet.status_dt)).format('DD/MM/YYYY');
    this.apiService.setTerminateStatus(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Thay đổi trạng thái thành công' });
        this.load();
        this.displayChangeStatus = false;
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    });
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện thao tác?',
      accept: () => {
        this.spinner.show();
        const queryParams = queryString.stringify({ terminateId: event.rowData.terminateId });
        this.apiService.delTerminateInfo(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa hồ sơ thành công' });
            this.load();
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }


  getCustObjectListNew() {
    const opts1 = { params: new HttpParams({ fromString: `objKey=terminate_key` }) };
    this.apiService.getObjectGroup(opts1.params.toString())
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      this.listTerminateKey = results.data.map(d => {
        return {
          name: d.name,
          code: d.value
        }
      });

      this.listTerminateKey = [...this.listTerminateKey]
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
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Quan hệ lao động' },
      { label: 'Danh sách hồ sơ nghỉ việc' },
    ];
    this.getTerminateFilter();
    this.initMenuItem();
  }
  menuItem = []
  initMenuItem() {
    this.menuItem = [
      {
        label: 'Lý do nghỉ việc',
        icon: 'pi pi-refresh',
        command: () => {
          this.router.navigate(['/nhan-su/ly-do-nghi-viec']);
        }
      },
      {
        label: 'HĐ mẫu nghỉ việc',
        icon: 'pi pi-refresh',
        command: () => {
          this.router.navigate(['/cai-dat/quan-ly-hop-dong']);
        }
      },
      {
        label: 'Import nghỉ việc',
        icon: 'pi pi-refresh',
        command: () => {
          this.router.navigate(['/nhan-su/ho-so-nghi-viec/import']);
        }
      },
    ]
  }

  getEmployeeStatus() {
    this.apiService.getEmployeeStatus()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        console.log(results, 'results results results ')
        this.employeeStatus = []
        results.data.forEach( s => {
            if(s.value == "3" || s.value == "4"){
              this.employeeStatus.push({
                label: s.name,
                value: s.value
              })
            }
          }
        )
        this.employeeStatus = [{ label: 'Tất cả', value: -1 }, ...this.employeeStatus];
      }
    })
  }

  companies = []

  getCompany() {
  }

  hrDiagram() {
    this.isHrDiagram = true;
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  getTerminateFilter() {
    this.apiService.getTerminateFilter()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
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


}



