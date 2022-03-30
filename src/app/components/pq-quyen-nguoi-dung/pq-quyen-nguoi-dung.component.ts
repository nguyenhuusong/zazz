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

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getUserPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
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
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 45;
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
    this.displayAdd = true;
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
    this.apiService.getUsersByCust(custId).subscribe((result: any) => {
      if (result.status === 'success') {
        this.gridApi1.setRowData(result.data);
        this.managerInfoList = result.data;
      }
    });
  }

  getListUserMaster(event) {
    const opts = { params: new HttpParams({ fromString: `filter=${event.query}&isUser=-1&isApprove=-1&intVehicle=0&offSet=null&pageSize=null` }) };
    this.apiService.getEmployeeList(opts.params.toString()).subscribe((result: any) => {
      this.listUserDetail = result.data;
      this.listUser = this.listUserDetail.map(res => {
        return {
          label: `${res.phone}---${res.email}`,
          value: res.custId
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
    this.detailUser = event.value;
    this.callApi(event.value);
  }


  initAgrid() {
    this.columnDefs1 = [{
      headerName: 'Tên đăng nhập',
      field: 'userLogin',
      resizable: true,
      cellClass: ['border-right']
    },
    {
      headerName: 'Trạng thái',
      field: 'lockName',
      cellClass: function (params) { return (params.value === 'Đang hoạt' ? ['border-right', 'text-center', 'text-success'] : ['border-right', 'text-center']); }
    },
    {
      headerName: 'Is admin',
      field: 'isAdmin',
      resizable: true,
      cellClass: ['border-right'],
      cellRenderer: (params) => {
        if (params.value) {
          return '<i class="fa fa-check" style="color: #337ab7;" title="Hiển thị"></i>';
        } else {
          return '<i class="fa fa-close firebrick" title="Không hiển thị"></i>';
        }
      }
    },
    {
      headerName: 'Thao tác',
      field: 'button',
      filter: '',
      cellRenderer: 'buttonRenderer1',
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
          hide: true
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
    parentId: ''
  }
  checkSquare(e) {
    this.displayAdd = true;
    this.seachManager = false;
    let items = this.listUserDetail.filter(res => res.custId === this.detailUser);
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

}

