import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { HttpParams } from '@angular/common/http';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-pq-quyen-nguoi-dung',
  templateUrl: './pq-quyen-nguoi-dung.component.html',
  styleUrls: ['./pq-quyen-nguoi-dung.component.scss']
})
export class PqQuyenNguoiDungComponent implements OnInit {

  dataQuyenNguoiDung: any;
  constructor(
    private apiService: ApiHrmService,
    private api: ApiService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
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
    pageSize: 15,
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getUserPage(queryParams).subscribe(
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
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.xoaNguoiDung.bind(this),
          label: 'Xóa tài khoản',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        },

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
  
  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  xoaNguoiDung(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện mở tài khoản?',
      accept: () => {
        const queryParams = queryString.stringify({ userId: event.rowData.userId });
        this.apiService.removeUser(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công quyền người dùng' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }


  titleForm = 'Thêm mới quyền người dùng'
  XemChiTiet({ rowData }) {
    this.titleForm = 'Chỉnh sửa quyền người dùng'
    this.chiTietNguoiDUng.userLogin = rowData.loginName;
    this.chiTietNguoiDUng.fullName = rowData.fullName;
    this.chiTietNguoiDUng.phone = rowData.phone;
    this.chiTietNguoiDUng.email = rowData.email;
    this.modelAdd.userId = rowData.userId;
    this.modelAdd.admin_st = rowData.admin_st;
    this.modelAdd.position = rowData.position;
    this.modelAdd.parentId = rowData.parentId;
    this.modelAdd.roles = rowData.roles;
    this.displayAdd = true;
    this.getRoles();
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
      { label: 'Phân quyền' },
      { label: 'Danh sách quyền người dùng' },
    ];
    this.getOrganize();
    this.getJobTitles();
    this.getPositionList();
    this.getManagerList();
    this.load();
  }
  listJobTitles = []
  getJobTitles() {
    this.apiService.getJobTitles().subscribe(results => {
      if (results.status === 'success') {
        this.listJobTitles = results.data.map(d => {
          return {
            label: d.job_name,
            value: d.jobId
          }
        })
      }
    })
  }


  seachManager = false
  themmoi() {
    this.seachManager = true;
    this.initAgrid();

  }

  managerLists: any = null;
  getManagerList() {
    const queryParams = queryString.stringify({ userRole: 1, byReport: 1 });
    this.apiService.getManagerList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.managerLists = results.data.map(d => {
          return {
            label: d.fullName + ' [' + d.loginName + ']',
            value: d.userId
          }
        });
        this.managerLists.push({ label: 'Chọn người duyệt', value: '' })
      }
    })
  }

  dataPositionList = []
  getPositionList() {
    const queryParams = queryString.stringify({ org_level: 0 });
    this.apiService.getPositionList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.dataPositionList = results.data.map(d => {
          return {
            label: d.positionName,
            value: d.positionId
          }
        });
      }
    })
  }

  onGridReady1(params) {
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi;
  }

  callApi(custId) {
    this.apiService.getUserSearchPage(custId).subscribe((result: any) => {
      if (result.status === 'success') {
        // this.gridApi1.setRowData(result.data.dataList.data);
        this.managerInfoList = result.data.dataList.data;
        this.initAgrid();
        this.spinner.hide();
      }
    });
  }
  organizes = [];
  getOrganize(): void {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams)
      .subscribe(
        (results: any) => {
          this.organizes = results.data
            .map(d => {
              return {
                label: d.organizationName || d.organizationCd,
                value: d.organizeId
              };
            });
          this.organizes = [{ label: 'Chọn tổ chức', value: '' }, ...this.organizes];
        }),
        error => { };
  }

  orgId = null;
  getListUserMaster(event) {
    this.apiService.getEmployeeSearch(  queryString.stringify({ filter: event.query, orgId: this.orgId })).subscribe((result: any) => {
      this.listUserDetail = result.data;
      this.listUser = this.listUserDetail.map(res => {
        return {
          label: `${res.phone}---${res.email}`,
          value: res.custId,
          ... res
        }
      });
    });
  }
  valueSearchUser
  gridColumnApi1
  listUser = [];
  listUserDetail = [];
  gridApi1
  managerInfoList = [];
  getRowHeight1
  columnDefs1 =[]
  detailUser: any;
  displayAdd = false;

  onSelectUser(event) {
    console.log(event)
    this.detailUser = event;
    this.callApi(event.phone);
  }

  roles = []
  getRoles() {
    const query = queryString.stringify({ filter: ''})
    this.api.getRolePage(query).subscribe(
      (results: any) => {
        if(results.status === "success")
          this.roles = results.data.dataList.data
            .map(d => {
              return {
                label: d.id,
                value: d.name
              };
            });
          this.roles = [{ label: 'Chọn nhóm quyền', value: '' }, ...this.roles];
      }),
      error => { };
  }


  initAgrid() {
    this.columnDefs1 = [
      {
        headerName: 'Tên đăng nhập',
        field: 'loginName',
        resizable: true,
        cellClass: ['border-right']
      },
      {
        headerName: 'Số điện thoại',
        field: 'phone',
        resizable: true,
        cellClass: ['border-right']
      },
      {
        headerName: 'Email',
        field: 'email',
        resizable: true,
        cellClass: ['border-right']
      },

      {
        headerName: 'Thao tác',
        field: 'button',
        filter: '',
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: (params) => this.showbuton(params)
      },]
    this.getRowHeight1 = params => {
      return 40;
    }
  }

  showbuton(e) {
    return {
      buttons: [
        {
          onClick: this.checkSquare.bind(this),
          label: 'Chọn',
          icon: 'fa fa-check-square-o',
          class: 'btn-primary mg-5',
        },
      ]
    }
  }

  chiTietNguoiDUng: any = {
    userLogin: '',
    fullName: '',
    phone: '',
    email: '',
  };
  modelAdd = {
    position: '',
    userId: '',
    admin_st: false,
    parentId: '',
    roles: []
  }
  checkSquare(e) {
    this.displayAdd = true;
    this.seachManager = false;
    let items = this.listUserDetail.filter(res => res.custId === this.detailUser.custId);
    this.titleForm = 'Thêm mới quyền người dùng'
    this.chiTietNguoiDUng = items[0]
  }

  save() {
    const params = {
      ...this.modelAdd, userId: this.chiTietNguoiDUng.userId
    }
    this.apiService.setUserAdd(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Thêm mới thành công' });
        this.load();
        this.displayAdd = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    })
  }

  goToSettingRole() {
    this.router.navigateByUrl('/phan-quyen/quyen-nguoi-dung/chi-tiet-quyen-nguoi-dung');
  }

}

