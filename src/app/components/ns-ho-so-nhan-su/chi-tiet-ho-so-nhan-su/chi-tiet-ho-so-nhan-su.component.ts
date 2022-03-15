import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as firebase from 'firebase';
import { API_PROFILE } from 'src/app/common/constants/constant';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';

@Component({
  selector: 'app-chi-tiet-ho-so-nhan-su',
  templateUrl: './chi-tiet-ho-so-nhan-su.component.html',
  styleUrls: ['./chi-tiet-ho-so-nhan-su.component.scss']
})

export class ChiTietHoSoNhanSuComponent implements OnInit, OnChanges {
  optionsButtonsView = [
    // { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ]
  API_PROFILE = API_PROFILE
  @Input() dataRouter = null;
  @Output() back = new EventEmitter<any>();
  manhinh = 'View';
  indexTab = 0;
  // optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  optionsButtonsSave = [{ label: 'Lưu lại', value: 'Save' }, { label: 'Hủy', value: 'Back' }];
  empId = null;
  listViews = [];
  listViewsForm = [];
  displayFormEditDetail = false;
  listViewsDependent = [];
  detailDependentInfo = null;
  imagesUrl = [];
  columnDefs = [[], [], [], []];
  listsData = [[], [], [], []];
  titles = ['', '', '', ''];
  paramsObject = null;
  displayUserInfo = false;
  detailInfo = null;
  detailMenu = { name: 'Thông tin cá nhân', code: API_PROFILE.THONG_TIN_CA_NHAN };
  titlePage = '';
  url = '';
  modelAttach = {
    employee_key: '',
    empId: null,
    metaId: null
  }

  statusApprover = [{ label: "Từ chối", value: 0 }, { label: 'Đồng ý', value: 1 }];
  modelDuyetHopDong = {
    contractId: null,
    status: 1,
    comment: ''
  }

  modelContractInfo = {
    contractId: null,
    contractTypeId: null,
    empId: null,
    detailInfo: null
  }
  hienthihopdong = false;
  displayAttach = false;

  menuItems: any[];
  listContractTypes = [];
  listUsersByAdmin = [];
  displayDialog = false;
  titleForm = {
    type: '',
    title: ''
  };
  modelDuyet = {
    empId: "",
    workDt: new Date(),
    exprire_date: new Date(),
    comments: "",
    full_name: "",
    reason_id: 0
  }
  displayCreateContract = false;
  listViewsRecordInfo = null;
  thongtinlienhe = {
    cont_id: null,
    custId: null
  }
  isShowAddress = false;
  isShowEditUserLogin = false;
  isShowAddUserLogin = false;
  keyName = '';
  displayuploadcontract = false;
  displayApproveContract = false;
  record = null;
  terminateReasons = [];
  selectedMenuCode = API_PROFILE.THONG_TIN_CA_NHAN;
  constructor(
    private apiService: ApiHrmService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  items = []
  ngOnChanges(): void {
    // this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
    // this.titlePage = null;
    // this.companyId = this.dataRouter.companyId;
    // this.manhinh = 'Edit';
    // this.getAccountInfo();
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Nhân sự' },
      { label: 'Hồ sơ nhân sự', url: '/nhan-su/ho-so-nhan-su' },
      { label: `${this.titlePage}` },
    ];
    this.getUsersByAdmin();
    this.getTerminateReasons();
    this.menuItems = [
      { name: 'Thông tin cá nhân', code: API_PROFILE.THONG_TIN_CA_NHAN },
      { name: 'Vị trí công việc', code: API_PROFILE.CONG_VIEC },
      { name: 'Quạn hệ lao động C&B', code: API_PROFILE.QUAN_HE_LAO_DONG },
      { name: 'Người quản lý', code: API_PROFILE.NGUOI_QUAN_LY },
      // { name: 'Liên hệ', code: API_PROFILE.LIEN_HE },
      { name: 'Thuế bảo hiểm', code: API_PROFILE.THUE_BAO_HIEM },
      // { name: 'Tiền lương', code: API_PROFILE.TIEN_LUONG },
      { name: 'Chuyên môn', code: API_PROFILE.CHUYEN_MON },
      { name: 'Tiện ích', code: API_PROFILE.TIEN_ICH },
      // { name: 'Người dùng', code: API_PROFILE.NGUOI_DUNG },
    ];
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    if (this.url === 'them-moi-nhan-vien') {
      this.manhinh = 'Edit';
      this.handleParams();
    } else {
      this.manhinh = 'Edit';
      this.handleParams();
    }
  }

  getContractTypes() {
    const queryParams = queryString.stringify({ organizeId: this.detailInfo.organizeId });
    this.apiService.getContractTypes(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listContractTypes = results.data.map(d => {
          return {
            label: d.contractTypeName,
            value: d.contractTypeId
          }
        });
      }
    })
  }


  getUsersByAdmin() {
    const queryParams = queryString.stringify({ admin_st: 1 });
    this.apiService.getUsersByAdmin(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listUsersByAdmin = results.data.map(d => {
          return {
            label: d.fullName + '-' + d.loginName,
            value: d.userId
          }
        });
      }
    })
  }

  getTerminateReasons() {
    this.apiService.getTerminateReasons().subscribe(results => {
      if (results.status === 'success') {
        console.log(results.data, 'results.data')
        this.terminateReasons = results.data;
      }
    })
  }

  initData(): void {
    this.columnDefs = [[], [], [], []];
    this.listsData = [[], [], [], []];
    this.titles = ['', '', '', ''];
  }

  onChangeMenu(e): void {
    this.manhinh = 'Edit';
    if (this.selectedMenuCode === API_PROFILE.CONG_VIEC) {
      this.optionsButtonsView =
        [
          { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' },
          { label: 'Duyệt hồ sơ', value: 'DuyetHoSo', class: '', icon: 'pi pi-check' },
          { label: 'Hủy hồ sơ', value: 'HuyHoSo', class: '', icon: 'pi pi-check' },
          { label: 'Mở Lại hồ sơ', value: 'MoLaiHoSo', class: '', icon: 'pi pi-check' },
          { label: 'Tuyển dụng lại', value: 'TuyenDungLai', class: '', icon: 'pi pi-check' },
          { label: 'Nghỉ việc', value: 'NghiViec', class: '', icon: 'pi pi-check' },
          // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
        ];
    } else if (this.selectedMenuCode === API_PROFILE.QUAN_HE_LAO_DONG) {
      this.optionsButtonsView =
        [
          // { label: 'Sửa', value: 'Edit' },
          { label: 'Tạo hợp đồng', value: 'TaoHopDong', class: '', icon: 'pi pi-check' },
          // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
        ];
    } else {
      this.optionsButtonsView = [{ label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' },
      //  { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
      ];
    }
    this.initData();
    this.getEmployeeInfo();
    this.detailMenu = this.menuItems.filter(d => d.code === this.selectedMenuCode)[0];
  }

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.empId = this.paramsObject.params.empId;
      this.getEmployeeInfo();
    });
  }

  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    this.listsData = [[], [], [], []];
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeData(this.selectedMenuCode, queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.bindingData(results.data);
         this.getContractTypes();
        if (this.selectedMenuCode === API_PROFILE.CONG_VIEC) {
          this.bindingDataButton(results.data);
        }
      }
    }, error => {
      this.spinner.hide();
    });
  }


  bindingDataButton(data): void {
    switch (data.emp_st) {
      case 0:
        this.optionsButtonsView =
          [
            { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' },
            { label: 'Duyệt hồ sơ', value: 'DuyetHoSo', class: '', icon: 'pi pi-check' },
            { label: 'Hủy hồ sơ', value: 'HuyHoSo', class: '', icon: 'pi pi-check' },
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
      case 1:
        this.optionsButtonsView =
          [
            // { label: 'Sửa', value: 'Edit' },
            { label: 'Chuyển công tác', value: 'ChuyenCongTac', class: '', icon: 'pi pi-check' },
            { label: 'Nghỉ việc', value: 'NghiViec', class: '', icon: 'pi pi-check' },
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
      case 2:
        this.optionsButtonsView =
          [
            { label: 'Mở Lại hồ sơ', value: 'MoLaiHoSo', class: '', icon: 'pi pi-check' },
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
      case 3:
        this.optionsButtonsView =
          [
            { label: 'Tuyển dụng lại', value: 'TuyenDungLai', class: '', icon: 'pi pi-check' },
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
      case 4:
        this.optionsButtonsView =
          [
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
      default:
        this.optionsButtonsView =
          [
            { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' },
            { label: 'Duyệt hồ sơ', value: 'DuyetHoSo', class: '', icon: 'pi pi-check' },
            { label: 'Hủy hồ sơ', value: 'HuyHoSo', class: '', icon: 'pi pi-check' },
            { label: 'Mở Lại hồ sơ', value: 'MoLaiHoSo', class: '', icon: 'pi pi-check' },
            { label: 'Tuyển dụng lại', value: 'TuyenDungLai', class: '', icon: 'pi pi-check' },
            { label: 'Nghỉ việc', value: 'NghiViec', class: '', icon: 'pi pi-check' },
            // { label: 'Quay lại', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' }
          ];
        break;
    }
  }

  bindingData(data): void {
    switch (this.selectedMenuCode) {
      case API_PROFILE.THONG_TIN_CA_NHAN:
        this.columnDefs[0] = [
          ...AgGridFn(data.gridflexdetails1 || [])
          , {
            headerName: '',
            field: 'gridflexdetails1ss',
            cellClass: ['border-right', 'no-auto'],
            width: 70,
            pinned: 'right',
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit',
                    key: 'xemchitietCard',
                    class: 'btn-primary mr-1',
                  },
                ]
              };
            },
          }];
        this.listsData[0] = data.idcards || [];
        this.titles[0] = 'Giấy tờ tùy thân';
        this.columnDefs[1] = [...AgGridFn(data.gridflexdetails2 || [])];
        this.listsData[1] = data.records || [];
        this.titles[1] = 'Hồ sơ cá nhân';
        this.columnDefs[2] = [
          ...AgGridFn(data.gridflexdetails3 || []),
          {
            headerName: '',
            field: 'gridflexdetails2',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'pi pi-cloud-upload',
                    key: 'xem-chi-tiet-file-dinh-kem',
                    class: 'btn-primary mr5',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'xoa-file-dinh-kem',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }];
        this.listsData[2] = data.attachs || [];
        this.titles[2] = 'Danh sách đính kèm';
        this.columnDefs[3] = [
          ...AgGridFn(data.gridflexdetails4 || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit',
                    key: 'xemchitietlienhe',
                    class: 'btn-primary mr-1',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'xoa-nguoi-phu-thuoc',
                    class: 'btn-danger',
                  },
                ]
              };
            },
          }];
        this.listsData[3] = data.trad_adds || [];
        this.titles[3] = 'Liên hệ khẩn cấp';
        this.spinner.hide();
        break;
      case API_PROFILE.LIEN_HE:

        this.spinner.hide();
        break;
      case API_PROFILE.QUAN_HE_LAO_DONG:
        this.columnDefs[0] = [
          ...AgGridFn(data.gridflexdetails1 || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'pi pi-cloud-upload',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Duyệt hợp đồng',
                    icon: 'pi pi-check',
                    key: 'duyet-hop-dong',
                    class: 'btn-danger',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'delete-qua-trinh-hop-dong',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }
        ];
        this.listsData[0] = data.contracts || [];
        this.titles[0] = 'Quá trình hợp đồng';
        this.columnDefs[1] = [...AgGridFn(data.gridflexdetails2 || [])];
        this.listsData[1] = data.salaries || [];
        this.titles[1] = 'Tiền lương';
        this.spinner.hide();
        break;
      case API_PROFILE.THUE_BAO_HIEM:
        this.columnDefs[0] = [
          ...AgGridFn(data.gridflexdetails1 || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit',
                    key: 'xemchitietlienhe',
                    class: 'btn-primary mr-1',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'xoa-nguoi-phu-thuoc',
                    class: 'btn-danger',
                  },
                ]
              };
            },
          }];
        this.listsData[0] = data.dependents || [];
        this.listsData[1] = data.attachs || [];
        this.titles[1] = 'Danh sách đính kèm';
        this.titles[0] = 'Người phụ thuộc';
        this.columnDefs[1] = [
          ...AgGridFn(data.gridflexdetails2 || []),
          {
            headerName: '',
            field: 'gridflexdetails2gg',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'pi pi-cloud-upload',
                    key: 'xem-chi-tiet-file-dinh-kem',
                    class: 'btn-primary mr5',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'xoa-file-dinh-kem',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }];

        this.spinner.hide();
        break;
      case API_PROFILE.CONG_VIEC:
        this.columnDefs[0] = [
          ...AgGridFn(data.gridflexdetails1 || []),
          {
            headerName: '',
            field: 'gridflexdetails2gg',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit',
                    key: 'sua_cong_viec',
                    class: 'btn-primary mr-1',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa ',
                    icon: 'pi pi-trash',
                    key: 'xoa_cong_viec',
                    class: 'btn-primary',
                  },
                ]
              };
            },
          }
        ];
        this.listsData[0] = data.workings || [];
        this.titles[0] = 'Thời gian làm việc';
        this.spinner.hide();
        break;
      case API_PROFILE.NGUOI_QUAN_LY:
        this.columnDefs[0] = [...AgGridFn(data.gridflexdetails1 || [])];
        this.listsData[0] = data.reportTos || [];
        this.titles[0] = 'Báo cáo cho';
        this.columnDefs[1] = [...AgGridFn(this.detailInfo.gridflexdetails2 || []),
        {
          headerName: '',
          field: 'gridflexdetails1',
          cellClass: ['border-right', 'no-auto'],
          pinned: 'right',
          width: 70,
          cellRenderer: 'buttonAgGridComponent',
          cellRendererParams: params => {
            return {
              buttons: [
                {
                  onClick: this.OnClick.bind(this),
                  label: 'Xem chi tiêt',
                  icon: 'fa fa-edit',
                  key: 'taikhoanlogin',
                  class: 'btn-primary mr-1',
                },
                {
                  onClick: this.OnClick.bind(this),
                  label: 'Xóa tài khoản đăng nhập',
                  icon: 'pi pi-trash',
                  key: 'xoataikhoandangnhap',
                  class: 'btn-primary',
                  hide: !params.data.lock_st
                },
                {
                  onClick: this.OnClick.bind(this),
                  label: 'Khóa',
                  icon: 'fa fa-edit',
                  key: 'dong-mo-tai-khoan',
                  class: 'btn-primary mr-1',
                  hide: params.data.lock_st === true
                },
                {
                  onClick: this.OnClick.bind(this),
                  label: 'Mở khóa',
                  icon: 'pi pi-trash',
                  key: 'dong-mo-tai-khoan',
                  class: 'btn-danger',
                  hide: params.data.lock_st === false
                },
              ]
            };
          },
        }];
        this.listsData[1] = data.users || [];
        this.titles[1] = 'Người dùng';
        this.spinner.hide();
        break;
      case API_PROFILE.TIEN_ICH:
        this.columnDefs[0] = [...AgGridFn(data.gridflexdetails1 || [])];
        this.listsData[0] = data.utiliies || [];
        this.titles[0] = 'Tiện ích';
        this.spinner.hide();
        break;
      case API_PROFILE.NGUOI_DUNG:
        this.columnDefs[0] = [
          ...AgGridFn(data.gridflexdetails1 || []),
          {
            headerName: '',
            field: 'gridflexdetails2gg',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit',
                    key: 'taikhoanlogin',
                    class: 'btn-primary mr-1',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xóa tài khoản đăng nhập',
                    icon: 'pi pi-trash',
                    key: 'xoataikhoandangnhap',
                    class: 'btn-primary',
                    hide: !params.data.lock_st
                  },
                ]
              };
            },
          }
        ];
        this.listsData[0] = data.users || [];
        this.titles[0] = 'Người dùng';
        this.spinner.hide();
        break;
      case API_PROFILE.CHUYEN_MON:
        this.columnDefs[0] = [...AgGridFn(data.gridflexdetails1 || [])];
        this.listsData[0] = data.works || [];
        this.titles[0] = 'Quá trình làm việc';
        this.columnDefs[1] = [...AgGridFn(data.gridflexdetails2 || [])];
        this.listsData[1] = data.education || [];
        this.titles[1] = 'Đào tạo';
        this.columnDefs[2] = [...AgGridFn(data.gridflexdetails3 || [])];
        this.listsData[2] = data.skills || [];
        this.titles[2] = 'Kỹ năng';
        this.columnDefs[3] = [...AgGridFn(data.gridflexdetails4 || [])];
        this.listsData[3] = data.licenses || [];
        this.titles[3] = 'Chứng chỉ';
        this.spinner.hide();
        break;
      default:
        this.initData();
        this.spinner.hide();
        break;
    }
  }

  handleChange(index): void {
    this.indexTab = index;
  }

  setEmployeeInfo(data): void {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmployeeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if (this.url === 'them-moi-cong-ty') {
          this.goBack();
        } else {
          this.manhinh = 'Edit';
          this.getEmployeeInfo();
        }
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  lockCard(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
      accept: () => {
        this.apiService.lockUser(e.rowData.userId).subscribe(results => {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa tài khoản thành công' });
          this.getEmployeeInfo();
        }, error => { });
      }
    });
  }

  unlockCard(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
      accept: () => {
        this.apiService.unLockUser(e.rowData.userId).subscribe(results => {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa tài khoản thành công' });
          this.getEmployeeInfo();
        }, error => { });
      }
    });
  }

  onChangeButtonSave(event) {
    if (event === 'Save') {
      let parmas: any = { ...this.modelDuyet };
      delete parmas.full_name;
      parmas.workDt = moment(new Date(parmas.workDt)).format('DD/MM/YYYY');
      parmas.exprire_date = moment(new Date(parmas.exprire_date)).format('DD/MM/YYYY');
      if (this.titleForm.type === 'HuyHoSo') {
        delete parmas.reason_id;
        delete parmas.exprire_date;
        this.setEmployeeCancel(parmas);
      } else if (this.titleForm.type === 'MoLaiHoSo') {
        delete parmas.reason_id;
        delete parmas.exprire_date;
        this.setEmployeeOpen(parmas);
      } else if (this.titleForm.type === 'NghiViec') {
        this.setEmployeeTermilate(parmas);
      }
    } else {
      this.displayDialog = false;
    }
  }

  xacNhan(event) {
    let parmas: any = { ...this.modelDuyet };
    delete parmas.full_name;
    parmas.workDt = moment(new Date(parmas.workDt)).format('DD/MM/YYYY');
    parmas.exprire_date = moment(new Date(parmas.exprire_date)).format('DD/MM/YYYY');
    if (this.titleForm.type === 'DuyetHoSo') {
      delete parmas.reason_id;
      delete parmas.exprire_date;
      parmas.group_fields = cloneDeep(event);
      this.setEmployeeApprove(parmas);
    } else if (this.titleForm.type === 'ChuyenCongTac') {
      delete parmas.reason_id;
      delete parmas.exprire_date;
      parmas.group_fields = cloneDeep(event);
      this.setEmployeeChange(parmas);
    } else {
      delete parmas.reason_id;
      delete parmas.exprire_date;
      parmas.group_fields = cloneDeep(event);
      this.setEmployeeRehired(parmas);
    }
  }

  setEmployeeCancel(parmas) {
    this.apiService.setEmployeeCancel(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận Hủy hồ sơ thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  setEmployeeOpen(parmas) {
    this.apiService.setEmployeeOpenhrm(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận mở lại hồ sơ thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  setEmployeeApprove(parmas) {
    this.apiService.setEmployeeApprovehrm(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận duyệt thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  setEmployeeChange(parmas) {
    this.apiService.setEmployeeChange(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận duyệt thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  setEmployeeTermilate(parmas) {
    this.apiService.setEmployeeTermilate(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận nghỉ việc thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  setEmployeeRehired(parmas) {
    this.apiService.setEmployeeRehired(parmas).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận tuyển dụng lại thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  goBack(): void {
    if (this.titlePage) {
      this.router.navigate(['/nhan-su/ho-so-nhan-su']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(button): void {
    this.modelDuyet.empId = this.detailInfo.empId;
    this.modelDuyet.full_name = this.detailInfo.fullName;
    if (button === 'Back') {
      this.goBack();
    } else if (button === 'HuyHoSo') {
      this.titleForm.title = 'Xác nhận hủy hồ sơ';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;

    } else if (button === 'MoLaiHoSo') {
      this.titleForm.title = 'Xác nhận mở lại hồ sơ';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;

    } else if (button === 'DuyetHoSo') {
      this.titleForm.title = 'Xác nhận duyệt hồ sơ';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;

    } else if (button === 'ChuyenCongTac') {
      this.titleForm.title = 'Chuyển công tác';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;

    } else if (button === 'NghiViec') {
      this.titleForm.title = 'Xác nhận nhân viên nghỉ việc';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;
      
    } else if (button === 'TuyenDungLai') {
      this.titleForm.title = 'Xác nhận nhân viên tuyển dụng lại';
      this.titleForm.type = button;
      this.manhinh = 'Edit';
      this.displayDialog = true;
    }else if (button === 'TaoHopDong') {
      this.taohopdong();
    } else {
      this.getEmployeeInfo();
    }
  }

  aGridFnMeta(table): void {
    this.columnDefs[0] = [
      ...AgGridFn(table),
    ];
  }

  createContract() {
    this.getRecordInfo()
  }
  listsDataRecord = []
  columnDefsRecord = []
  getRecordInfo() {
    const queryParams = queryString.stringify({ empId: this.detailInfo.empId });
    this.apiService.getRecordInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listsDataRecord = results.data.records || [];
        this.listViewsRecordInfo = results.data;
        this.columnDefsRecord = [
          ...AgGridFn(this.listViewsRecordInfo.gridflexdetails1 || [])
          , {
            headerName: 'Tải lên hồ sơ',
            field: 'button234',
            cellClass: ['border-right'],
            width: 100,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Tải lên hồ sơ',
                    icon: 'pi pi-cloud-download',
                    class: 'btn-primary mr5',
                    key: 'tailenhoso',
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem hồ sơ',
                    icon: 'pi pi-cloud-upload',
                    key: 'xemhoso',
                    class: 'btn-primary mr5',
                    hide: !params.data.meta_file_url
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Hủy hồ sơ',
                    icon: 'pi pi-trash',
                    key: 'huyhosocanhan',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }];

        this.displayCreateContract = true;
      }
    });
  }

  OnClick(event): void {
    if (event.event.item.key === 'tailenhoso') {
      this.uploadContract(event)
    } else if (event.event.item.key === 'xemhoso') {
      this.ViewContract(event)
    }else if (event.event.item.key === 'huyhosocanhan') {
      this.HuyHoSo(event)
    } else if (event.event.item.key === 'sua_cong_viec') {
      this.titleType0 = 'Sửa thời gian làm việc';
      const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, gd: event.rowData.gd });
      this.getEmpWorking(queryParams);
    } else if (event.event.item.key === 'xoataikhoandangnhap') {
      this.xoaNguoiDung(event);
    } else if (event.event.item.key === 'xoa_cong_viec') {
      this.deleteCustUser(event.rowData.loginName);
    } else if (event.event.item.key === 'dong-mo-tai-khoan') {
      if (event.rowData.lock_st) {
        this.unlockCard(event);
      } else {
        this.lockCard(event);
      }
    } else if (event.event.item.key === 'taikhoanlogin') {
      this.isShowEditUserLogin = true;
      this.keyName = event.rowData.loginName;
    } else if (event.event.item.key === 'xoa-nguoi-phu-thuoc') {
      if (this.selectedMenuCode === API_PROFILE.THUE_BAO_HIEM) {
        this.DeleteDependent(event)
      } else {
        this.delEmpContact(event)
      }
    } else if (event.event.item.key === 'huyhosoky') {
      this.DeleteMeta(event)
    } else if (event.event.item.key === 'duyet-hop-dong') {
      this.modelDuyetHopDong.contractId = event.rowData.contractId;
      this.modelDuyetHopDong.comment = '';
      this.displayApproveContract = true;
    } else if (event.event.item.key === 'view-qua-trinh-hop-dong') {
      this.XemQuaTrinhHopDong(event)
    } else if (event.event.item.key === 'delete-qua-trinh-hop-dong') {
      this.XoaQuaTrinhHopDong(event)
    } else if (event.event.item.key === 'xemchitietlienhe') {
      if (this.selectedMenuCode === API_PROFILE.LIEN_HE) {
        this.titleType0 = 'Chỉnh sửa thông tin người liên hệ';
        const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, cont_id: event.rowData.cont_id });
        this.getEmpContact(queryParams);
      } else {
        this.titleType0 = 'Chỉnh sửa thông tin người phụ thuộc';
        const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, dependentId: event.rowData.dependentId });
        this.getEmpDependent(queryParams);
      }
    } else if (event.event.item.key === 'xemchitietCard') {
      
      if (this.selectedMenuCode === API_PROFILE.THONG_TIN_CA_NHAN) {
        this.getCustIndiIdentity(event)
      } else {
        // const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, dependentId: event.rowData.dependentId });
        // this.getEmpDependent(queryParams);
      }

    } else if (event.event.item.key === 'xem-chi-tiet-file-dinh-kem') {
      this.modelAttach = {
        employee_key: this.detailInfo.employee_key,
        empId: this.detailInfo.empId,
        metaId: event.rowData.metaId
      }
      this.displayAttach = true;
    } else if (event.event.item.key === 'xoa-file-dinh-kem') {
      if (this.selectedMenuCode === API_PROFILE.THONG_TIN_CA_NHAN) {
        this.deleteAttach(event);
      } else {
        this.XoaQuaTrinhHopDong(event)
      }
    }
  }

  duyetHoSo() {
    this.spinner.show();
    this.apiService.setContractStatus(this.modelDuyetHopDong).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.displayApproveContract = false;
        this.getEmployeeInfo();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }

  cancelContract() {
    this.spinner.show();
    this.apiService.setContractStatus({
      contractId: this.modelDuyetHopDong.contractId
    }).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.getEmployeeInfo();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }


  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  onAddUserLogin() {
    this.isShowAddUserLogin = true;
    this.keyName = ''
  }

  deleteCustUser(loginName) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thông tin tài khoản này không  ?',
      accept: () => {
        const queryParams = queryString.stringify({ loginName: loginName, cif_no: this.detailInfo.cif_no });
        this.apiCoreService.deleteCustUser(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
  xoaNguoiDung(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện thao tác này ?',
      accept: () => {
        const queryParams = queryString.stringify({ loginName: event.rowData.loginName });
        this.apiService.deleteUser(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công quyền người dùng' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  HuyHoSo(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hủy hồ sơ này ?',
      accept: () => {
        console.log(event)
        const indexobj = this.listsData[3].findIndex(d => d.source_id === event.rowData.source_id);
        let record = { ... this.listsData[3][indexobj] };
        record.meta_file_url = "";
        record.meta_file_size = "";
        record.meta_file_name = "";
        record.meta_file_size_name = "";
        record.meta_file_type = "";
        this.listsData[3][indexobj] = record;
        this.listsData[3] = [... this.listsData[3]];
        this.listViewsRecordInfo.records = this.listsData[3];
      }
    });
  }

  delEmpWorking(gd) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thông tin này ?',
      accept: () => {
        const queryParams = queryString.stringify({ gd: gd });
        this.apiService.delEmpWorking(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  saveUserLogin() {
    if (!this.keyName) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Nhập user cần tạo !' });
      return;
    }
    const params = {
      loginName: this.keyName,
      cif_no: this.detailInfo.cif_no
    }
    this.apiCoreService.setCustUser(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages });
        this.isShowAddUserLogin = false;
        this.getEmployeeInfo();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.messages });
      }
    })
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_file_url);
  }
  getCustIndiIdentity(event) {
    const params = { custId: event.rowData.custId, idcard_no: event.rowData.idcard_no };
    const queryParams = queryString.stringify(params);
    this.apiCoreService.getCustIndiIdentity(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.thongtinchitietthe = results.data;
        this.isShowCustIndiCreate = true;
        this.isShowRegister = true;
      }
    })
  }

  XemQuaTrinhHopDong(event) {
    this.modelContractInfo = {
      contractId: event.rowData.contractId,
      contractTypeId: null,
      empId: this.detailInfo.empId,
      detailInfo: this.detailInfo
    }
    this.hienthihopdong = true;
  }

  XoaQuaTrinhHopDong(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa hợp đồng?',
      accept: () => {
        const queryParams = queryString.stringify({ contractId: event.rowData.contractId });
        this.apiService.delContractInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa hợp đồng thành công' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  deleteAttach(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa hợp đồng?',
      accept: () => {
        const queryParams = queryString.stringify({ meta_id: event.rowData.meta_id });
        this.apiService.delEmpAttach(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa file đính kèm thành công' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  DeleteDependent(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa người phụ thuộc này?',
      accept: () => {
        const queryParams = queryString.stringify({ dependentId: event.rowData.dependentId });
        this.apiService.delEmpDependent(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa người phụ thuộc thành công' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  delEmpContact(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa người liên hệ này?',
      accept: () => {
        const queryParams = queryString.stringify({ cont_id: event.rowData.cont_id });
        this.apiService.delEmpContact(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa người liên hệ thành công' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  DeleteMeta(event) {

  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  handleUpload(datas) {
    if (datas.length > 0) {
      const indexobj = this.listsData[3].findIndex(d => d.source_id === this.record.source_id);
      let record = { ... this.listsData[3][indexobj] };
      record.meta_file_url = datas[0].url;
      record.meta_file_type = datas[0].type;
      record.meta_file_size = datas[0].size;
      record.meta_file_name = datas[0].name;
      this.listsData[3][indexobj] = record;
      this.listsData[3] = [... this.listsData[3]];
      this.listViewsRecordInfo.records = this.listsData[3];
      this.displayuploadcontract = false;
    }
  }
  saveCreateContract() {
    this.spinner.show();
    this.apiService.setRecordInfo(this.listViewsRecordInfo).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
        this.displayCreateContract = false;
        this.getEmployeeInfo();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  createAttach() {
    this.modelAttach = {
      employee_key: this.detailInfo.employee_key,
      empId: this.detailInfo.empId,
      metaId: null,
    }
    this.displayAttach = true;
  }

  taohopdong() {
    this.modelContractInfo = {
      detailInfo: this.detailInfo,
      contractId: this.detailInfo.contractId || null,
      contractTypeId: this.listContractTypes[0].value,
      empId: this.detailInfo.empId
    }
    this.hienthihopdong = true;
  }

  emitContract(event) {
    this.hienthihopdong = false;
    this.getEmployeeInfo();
  }

  emitAttach(e) {
    this.displayAttach = false;
    this.getEmployeeInfo();
  }
  isShowRegister = false;
  isShowCustIndiCreate = false;
  detailCard = null;
  showPopupUploadCard() {
    this.isShowRegister = false;
    this.isShowCustIndiCreate = true;
  }

  confirmCheckCard(data) {
    console.log(data)
    const images = data.images.map(res => {
      return {
        metaId: null,
        metaNote: res.directionType,
        metaName: res.name,
        metaUrl: res.url,
        metatype: '',
        doc_type: 'identity' + data.info.typeCard,
        doc_sub_type: res.doc_sub_type,
        doc_sub_type_name: '',
        noneUrl: ''
      }
    });
    this.detailCard = {
      recognition_rt: data.card_info.religion,
      idcard_type: data.info.typeCard,
      idcard_no: data.card_info.id,
      fullName: data.card_info.name,
      sex: data.card_info.sex === 'Nam' ? true : false,
      birthday: this.stringToDate(data.card_info.birthday),
      idcard_issue_dt: this.stringToDate(data.card_info.issue_date),
      idcard_expire_dt: data.card_info.expiry ? this.stringToDate(data.card_info.expiry) : moment(new Date(2050, 1, 1)).format('DD/MM/YYYY'),
      idcard_issue_plc: data.card_info.issue_by,
      origin_add: data.card_info.address,
      res_add: data.card_info.hometown,
      res_cntry: data.card_info.country,
      metas: images
    }
    this.sendCustIndiCreate(this.detailCard)
  }

  stringToDate(value) {
    if (!value) {
      return null;
    }
    return value.split('-').join('/')
  }

  thongtinchitietthe = null;
  sendCustIndiCreate(datasCard) {
    const params = {
      ...datasCard,
      custId: this.detailInfo.custId
    }
    this.apiCoreService.setCustIndiIdentityCreate(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages });
        this.thongtinchitietthe = results.data;
        this.isShowRegister = true;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.messages });
      }
    });
  }

  onReloadCard() {
    this.isShowRegister = false;
    this.isShowCustIndiCreate = false;
    this.getEmployeeInfo();
  }

  onHideCreate() {
    this.isShowCustIndiCreate = false;
    this.isShowRegister = false;
    this.thongtinchitietthe = null;
  }

  reloaddanhsachlienhe() {
    this.getEmployeeInfo();
    this.isShowAddress = false;
  }
  titleType0 = '';
  displayNguoiDung = false;
  detailAccount = {
    cif_no: '',
    source_type: 'hrm',
    sub_prod_cd: '001001',
    account_no: ''
  }

  addType0() {
    this.listViewsDependent = [];
    if (this.selectedMenuCode === API_PROFILE.THUE_BAO_HIEM) {
      this.titleType0 = 'Thêm mới người phụ thuộc';
      const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, dependentId: null });
      this.getEmpDependent(queryParams);
    } else if (this.selectedMenuCode === API_PROFILE.TIEN_ICH) {
      this.displayNguoiDung = true;
    } else if (this.selectedMenuCode === API_PROFILE.CONG_VIEC) {
      this.titleType0 = 'Thêm mới thời gian làm việc';
      const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, gd: null });
      this.getEmpWorking(queryParams);
    }
  }

  addType3() {
    this.listViewsDependent = [];
    this.titleType0 = 'Thêm mới người liên hệ';
    const queryParams = queryString.stringify({ employeeCd: this.detailInfo.employeeCd, cont_id: null });
    this.getEmpContact(queryParams);
  }

  getEmpContact(query) {
    this.listViewsDependent = [];
    this.apiService.getEmpContact(query).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDependent = cloneDeep(results.data.group_fields);
        this.detailDependentInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  getEmpDependent(query) {
    this.listViewsDependent = [];
    this.apiService.getEmpDependent(query).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDependent = cloneDeep(results.data.group_fields);
        this.detailDependentInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  getEmpWorking(query) {
    this.listViewsDependent = [];
    this.apiService.getEmpWorking(query).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDependent = cloneDeep(results.data.group_fields);
        this.detailDependentInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setEmpDependen(data) {
    const param = {
      ...this.detailDependentInfo, group_fields: data
    }
    this.spinner.show();
    if (this.selectedMenuCode === API_PROFILE.THUE_BAO_HIEM) {
      this.apiService.setEmpDependent(param).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages ? results.messages : 'Thêm mới thành công' });
          this.displayFormEditDetail = false;
          this.getEmployeeInfo();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages });
        }
      })
    } else if (this.selectedMenuCode === API_PROFILE.CONG_VIEC) {
      this.apiService.setEmpWorking(param).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages ? results.messages : 'Thêm mới thành công' });
          this.displayFormEditDetail = false;
          this.getEmployeeInfo();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages });
        }
      })
    } else {
      this.apiService.setEmpContact(param).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages ? results.messages : 'Thêm mới thành công' });
          this.displayFormEditDetail = false;
          this.getEmployeeInfo();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages });
        }
      })
    }

  }

  saveUserLoginEdit() {
    this.isShowEditUserLogin = false;
    this.getEmployeeInfo();
  }

}

