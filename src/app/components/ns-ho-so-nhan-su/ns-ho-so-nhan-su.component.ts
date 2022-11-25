import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
@Component({
  selector: 'app-ns-ho-so-nhan-su',
  templateUrl: './ns-ho-so-nhan-su.component.html',
  styleUrls: ['./ns-ho-so-nhan-su.component.scss']
})
export class NsHoSoNhanSuComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  excelStyles = [
    {
      id: 'stringType',
      dataType: 'string'
    },
    {
      id: 'dateType',
      dataType: 'dateTime'
    },
    {
      id: 'numberType',
      dataType: 'number'
    }
  ];
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
  listsData = null;
  selectedNode
  capaStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Chưa duyệt', value: 0 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 2 },
    { label: 'Khởi tạo', value: null },
  ]
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  isShowAvatar = false;
  imgAvatar = '';
  modelTM: any = {};
  displayEmployee = false;

  // for the move organ
  departmentFiltes = [];
  departmentFiltes2 = [];
  organizeId = '';
  aDepartment: any;
  theOrganToMoveData = []
  isTheOrganToMove = false;
  queryStaffToMove = {
    organizeId: '',
    orgId: '',
    members: []
  }
  organs = []
  isButtonmoveOrganNow = true;
  itemsToolOfGrid: any[] = [];
  companies = []
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    private router: Router) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      tooltipComponentParams: { color: '#ececec' },
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
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
    orgId: '',
    isLock: -1,
    isApprove: -1,
    emp_st: -1,
    organizeIds: '',
    companyIds: '',
  }

  titleForm = {
    label: 'Thêm mới phòng ban',
    value: 'Add'
  }
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  displayButton = false;
  detailOrganizeMap = null;

  departments = [];

  isHrDiagram: boolean = false

  onmouseenter(event) {
    console.log(event)
  }
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      orgId: this.query.orgId,
      isLock: -1,
      isApprove: -1,
      emp_st: -1,
      organizeIds: this.query.organizeIds,
      companyIds: this.query.companyIds,
    }
    if(this.companies.length > 0) {
      this.query.companyIds = this.companies[0].value;
    }
    this.load();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  expanded(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
      }
      d.children.forEach((elm: { children: { expanded: boolean; }[]; expanded: boolean; }) => {
        elm.children.forEach((e: { expanded: boolean; }) =>{
          if (e.expanded === true) {
            elm.expanded = true
          }
        })
      });      
    })
    return datas
  }

  selected(datas = [], orgId: any = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }

  themnhanvien() {
    const params = {
      empId: 0
    }
    this.router.navigate(['/ho-so-nhan-su/them-moi-nhan-vien'], { queryParams: params });
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }


  load() {
    this.columnDefs = []
    this.spinner.show();
    const params: any = { ...this.query };
    let companyIds = this.query.companyIds.toString();
    params.companyIds = companyIds;
    params.organizeIds = this.query.organizeIds;
    params.orgId = params.orgId.orgId;
    const queryParams = queryString.stringify(params);
    this.apiService.getEmployeePage(queryParams).subscribe(
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
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
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
          onClick: this.EditEmployee.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmployeePage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.xoanhanvien.bind(this),
          label: 'Xóa nhân viên này',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmployeePage.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: false,
        maxWidth: 50,
        pinned: 'left',
        cellRenderer: params => {
          // return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: false,
        field: 'checkbox2',
        suppressSizeToFit: false,
        suppressColumnsToolPanel: false,
        checkboxSelection: (params) => {
          return !!params.data && params.data.emp_st === 0;
        },
        showDisabledCheckboxes: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: '...',
        filter: '',
        maxWidth: 64,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right cell-action', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]

    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.AgencyGenerals);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.AgencyGenerals.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  xoanhanvien(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa nhân viên?',
      accept: () => {
        this.apiService.deleteEmployee(event.rowData.empId).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  staffActivity(event) {
    this.confirmationService.confirm({
      target: event.target,
      message: "Quản trị cần xác nhận nhân viên trong ngày làm việc đầu tiên là 'Xác nhận làm việc'. Ngày làm việc cuối cùng là 'Chấm dứt hợp đồng'",
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Chấm dứt hợp đồng',
      acceptLabel: 'Xác nhận làm việc',
      key: 'hosonhansu',
      acceptButtonStyleClass: 'p-button-sm',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.unLockEmployee({
          empId: event.rowData.empId
        })
      },
      reject: () => {
        this.setEmployeeClose({
          empId: event.rowData.empId
        })
      }
    });
  }

  unLockEmployee(params) {
    this.apiService.setEmployeeOpenhrm(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận làm việc thành công' });
        this.load();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }

  setEmployeeClose(params) {
    this.apiService.setEmployeeClose(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận nghỉ việc thành công' });
        this.load();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }


  staffApprove(event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Bạn có muốn phê duyệt/hủy phê duyệt nhân viên này không?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Hủy phê duyệt',
      acceptLabel: 'Phê duyệt',
      key: 'hosonhansu',
      acceptButtonStyleClass: 'p-button-sm',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.setAccountStatus({
          empId: event.rowData.empId,
          status: true
        })
      },
      reject: () => {
        this.setAccountStatus({
          empId: event.rowData.empId,
          status: false
        })
      }
    });
  }

  setAccountStatus(params) {
    this.apiService.setEmployeeApprovehrm(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: params.status ? 'Phê duyệt thành công' : 'Hủy phê duyệt thành công' });
        this.load();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }

  EditEmployee(event) {
    const params = {
      empId: event.rowData.empId
    }
    this.router.navigate(['/nhan-su/ho-so-nhan-su/chi-tiet-ho-so-nhan-su'], { queryParams: params });
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
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = results;
          this.getOrganizeTree();
          this.getCompany();
        }
    });
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Nhân sự' },
      { label: 'Quản lý nhân sự' },
    ];
    this.getEmployeeStatus();
    this.getOrgan();
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeePage.url, ACTIONS.IMPORT),
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeePage.url, ACTIONS.EXPORT),
        command: () => {
          this.exportExel();
        }
      },
    ]
  }
  employeeStatus = []
  getEmployeeStatus() {
    this.apiService.getEmployeeStatus().subscribe(results => {
      if (results.status === 'success') {
        this.employeeStatus = []
        results.data.forEach(s => {
          if (s.value != "3") {
            this.employeeStatus.push({
              label: s.name,
              value: s.value
            })
          }
        }
        )
        this.employeeStatus = [{ label: 'Chọn trạng thái', value: -1 }, ...this.employeeStatus];
      }
    })
  }
  organizeList = []
  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    localStorage.setItem('organize', JSON.stringify(event.node));
    // this.query.orgId = this.selectedNode?.orgId;
    this.query.orgId = this.detailOrganizeMap?.orgId;
    this.isHrDiagram = false;

    this.load()
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }

  onCellClicked(event) {
    if (event.column.colId == "avatar_url") {
      this.isShowAvatar = true;
      this.imgAvatar = event.value;
    }
  }

  exportGrid() {
    this.gridApi.exportDataAsExcel();
  }

  getContextMenuItems(params) {
    var result = [
      'copy',
      'paste',
      'separator',
    ];
    return result;
  }

  exportExel() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeePage(queryParams).subscribe(
      (results: any) => {
        const dataExport = [];
        let gridflexs = results.data.gridflexs;
        let arrKey = gridflexs.map(elementName => elementName.columnField);

        let dataList = results.data.dataList.data;
        for (let elementValue of dataList) {
          const data: any = {};
          for (let elementName of gridflexs) {
            if (arrKey.indexOf(elementName.columnField) > -1 && !elementName.isHide && elementName.columnField !== 'statusName') {
              let valueColumn = elementValue[elementName.columnField];
              if (elementName.columnField == 'status_name' || elementName.columnField == 'isContacted' || elementName.columnField == 'isProfileFull' || elementName.columnField == 'lockName') {
                valueColumn = this.replaceHtmlToText(valueColumn);
              }
              data[elementName.columnCaption] = valueColumn || '';
            }

          }

          dataExport.push(data);
        }
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách hồ sơ nhân sự ' + new Date());

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  columnDefsMoveOrgan = [];
  getColumnDefsMoveOrgan() {
    this.columnDefsMoveOrgan = [
      {
        headerName: 'Stt',
        filter: '',
        maxWidth: 90,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
      },
      {
        headerName: 'Mã NV',
        filter: '',
        cellClass: ['border-right', 'yellow-bg'],
        field: 'code',
        editable: true
      },
      {
        headerName: 'Họ tên',
        filter: '',
        cellClass: ['border-right'],
        field: 'full_name',
      },
      {
        headerName: 'Số ĐT',
        filter: '',
        cellClass: ['border-right'],
        field: 'phone1',
      },
      {
        headerName: 'Tổ chức',
        filter: '',
        cellClass: ['border-right'],
        field: 'organization',
      },
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 120,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons2(params),
        field: 'button'
      }
    ]
  }

  showButtons2(params) {
    return {
      buttons: [
        {
          onClick: this.delStaffinDataOraMove.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  delStaffinDataOraMove(data) {
    this.theOrganToMoveData = this.theOrganToMoveData.filter(a => a.CustId != data.rowData.CustId);
    if (this.theOrganToMoveData.length < 1) {
      this.isButtonmoveOrganNow = true
    }
  }
  theOrganToMove() {
    // ColumnDefs for data move 
    this.getColumnDefsMoveOrgan();
    this.getOrgan();
    if (this.listDataSelect.length > 0) {
      this.theOrganToMoveData = cloneDeep(this.listDataSelect);
      this.isTheOrganToMove = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng nhân sự' });
    }
  }

  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organs = results.data.map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        this.organs = [...this.organs];
      }
    })
  }

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
    this.queryStaffToMove.orgId = '';
    this.aDepartment = '';
    if(this.organizeId && this.queryStaffToMove.orgId){
      this.isButtonmoveOrganNow = false;
    }
    else {
      this.isButtonmoveOrganNow = true;
    }
  }
 
  getOrganizeTree2(): void {
    const queryParams = queryString.stringify({ parentId: this.organizeId });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes2 = results.data;
        }
      },
        error => { });
    this.queryStaffToMove.orgId = '';
    this.aDepartment = '';
    if(this.organizeId && this.queryStaffToMove.orgId){
      this.isButtonmoveOrganNow = false;
    }
    else {
      this.isButtonmoveOrganNow = true;
    }
  }

  // handleChangeOrganize() {
  //   this.getOrganizeTree();
  // }
  onChangeTreeDepart(event) {
    this.queryStaffToMove.orgId = event.node.orgId;
    // if(this.organizeId && event.node.orgId){
    //   this.isButtonmoveOrganNow = false;
    // }
    // else {
    //   this.isButtonmoveOrganNow = true;
    // }

    //MS-773
    this.isButtonmoveOrganNow = false;
  }
  moveOrganNow() {
    if (this.theOrganToMoveData.length > 0) {
      this.getOrganizeTree2();
      this.queryStaffToMove.organizeId = this.organizeId;
      this.queryStaffToMove.members = this.theOrganToMoveData.map(o => {
        return {
          empId: o.empId,
          code: o.code
        }
      })
      this.apiService.setListEmployeeChange(this.queryStaffToMove).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thành công' });
          this.load();
          this.listDataSelect = []
          this.isTheOrganToMove = false
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      })
    }
  }
  listDataSelect = [];
  rowSelected(data) {
    if(data[0] && data[0].emp_st !== 1 && data[0].emp_st !== 2 ){
      this.listDataSelect = data
    }else{
      this.listDataSelect = [];
    }
  }

  getCompany() {
    const query = { organizeIds: this.query.organizeIds}
    this.apiService.getUserCompanies(queryString.stringify(query)).subscribe(
      (results: any) => {
        if(results.status === "success"){
          this.companies = results.data
            .map(d => {
              return {
                label: d.companyName,
                value: d.companyId
              };
            });
            if(this.companies.length > 0) {
              this.query.companyIds = this.companies[0].value
            }
            this.load();
        }
      }),
      error => { };
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    // const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  importFileExel() {
    this.router.navigate(['/nhan-su/ho-so-nhan-su/import']);
  }

  ngAfterContentChecked(): void {

    this.changeDetector.detectChanges();
  }

}
