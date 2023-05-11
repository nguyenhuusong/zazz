import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, getActionByPathMenu } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { AuthService } from 'src/app/services/auth.service';
import { getParamString, searchTree } from 'src/app/common/function-common/objects.helper';
import { DialogService } from 'primeng/dynamicdialog';
import * as FileSaver from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
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
  listsData = [];
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
  companies = [];
  listActions = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    public dialogService: DialogService,
    
    private authService: AuthService,
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
    this.initMenuActionPages(getActionByPathMenu('quan-he-lao-dong', this.MENUACTIONROLEAPI.GetEmployeePage.url, ['import', 'export']))
  }

  initMenuActionPages(listMenus) {
    this.itemsToolOfGrid = [];
    for (let item of listMenus) {
      this.itemsToolOfGrid.push({
        label: item.actionName,
        code: item.actionCd,
        icon: item.actionCd === 'import' ? 'pi pi-upload' : item.actionCd === 'export' ? 'pi pi-download' : 'pi-info-circle',
        command: () => {
          this[item.actionCd]();
        }
      })
    }
  }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 20,
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 20,
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
        elm.children.forEach((e: { expanded: boolean; }) => {
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
    // this.spinner.show();
    const params: any = { ...this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getEmployeePage(queryParams)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(
      (results: any) => {
        this.isShow = true;
        this.listsData = results.data.dataList.data;
        this.gridKey = results.data.dataList.gridKey;
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
          onClick: this.editRow.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa nhân viên này',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: event.data.emp_st !== 0
        },
        {
          onClick: this.SetEmployeeBlock.bind(this),
          label: 'Phong tỏa',
          icon: 'pi pi-align-center',
          class: 'btn-primary mr5',
          hide: this.checkSetEmployeeBlock(event)
        },
        {
          onClick: this.SetEmployeeOpen.bind(this),
          label: 'Mở phong tỏa',
          icon: 'pi pi-align-center',
          class: 'btn-primary mr5',
          hide: this.checkSetEmployeeOpen(event)
        },
        {
          onClick: this.LockEmployee.bind(this),
          label: 'khóa hồ sơ',
          icon: 'pi pi-align-center',
          class: 'btn-primary mr5',
          hide: this.checkLockEmployee(event)
        },
        {
          onClick: this.UnLockEmployee.bind(this),
          label: 'Mở khóa hồ sơ',
          icon: 'pi pi-align-center',
          class: 'btn-primary mr5',
          hide: this.checkUnLockEmployee(event)
        },
        {
          onClick: this.ApprovedEmail.bind(this),
          label: 'Xác nhận qua email',
          icon: 'pi pi-inbox',
          class: 'btn-primary mr5',
        },
      ]
    };
  }

//   emp_st = 0: Xóa, Phong tỏa
// emp_st = 2: Xóa, Mở phong tỏa
// emp_st = 1, islock = false: Khóa
// emp_st = 1, islock = true: Mở khóa
  checkSetEmployeeOpen(event) {
    if(event.data.emp_st === 2) {
      return false
    }
    return true
  }
  checkSetEmployeeBlock(event) {
    if(event.data.emp_st === 0) {
      return false
    }
    return true
  }

  checkUnLockEmployee(event) {
    if(event.data.emp_st === 1 && event.data.lock_st) {
      return false
    }
    return true
  }

  checkLockEmployee(event) {
    if(event.data.emp_st === 1 && !event.data.lock_st) {
      return false
    }
    return true
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

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa nhân viên?',
      accept: () => {
        this.apiService.deleteEmployee(event.rowData.empId)
         .pipe(takeUntil(this.unsubscribe$))
         .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  ApprovedEmail(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn gửi email nhân viên?',
      accept: () => {
        this.apiService.takeConfirmEmail({userId: event.rowData.userId})
         .pipe(takeUntil(this.unsubscribe$))
         .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  SetEmployeeBlock(event) {
    this.modelBlockAndOpen = {
      empId: event.rowData.empId,
      workDt: null,
      comments: null,
      type: 'block'
    }
    this.displayApproveContract = true;
  }
 
  SetEmployeeOpen(event) {
    this.modelBlockAndOpen = {
      empId: event.rowData.empId,
      workDt: null,
      comments: null,
      type: 'open'
    }
    this.displayApproveContract = true;
  }

  LockEmployee(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn khóa  hồ sơ nhân viên ?',
      accept: () => {
        this.apiService.lockEmployeeV2({empId :event.rowData.empId})
         .pipe(takeUntil(this.unsubscribe$))
         .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  UnLockEmployee(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn mở khóa hồ sơ nhân viên ?',
      accept: () => {
        this.apiService.unLockEmployeeV2({empId :event.rowData.empId})
         .pipe(takeUntil(this.unsubscribe$))
         .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa nhân viên thành công' });
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
    this.apiService.setEmployeeOpenhrm(params)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận làm việc thành công' });
        this.load();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }

  setEmployeeClose(params) {
    this.apiService.setEmployeeClose(params)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
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
    this.apiService.setEmployeeApprovehrm(params)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: params.status ? 'Phê duyệt thành công' : 'Hủy phê duyệt thành công' });
        this.load();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }

  editRow({rowData}) {
    const params = {
      empId: rowData.empId
    }
    this.router.navigate(['/nhan-su/ho-so-nhan-su/chi-tiet-ho-so-nhan-su'], { queryParams: params });
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
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quan hệ lao động' },
      { label: 'Hồ sơ nhân sự' },
    ];
    this.getEmpFilter();

  }
  employeeStatus = []
  getEmployeeStatus() {
    // let empId = this
    this.apiService.getEmployeeStatus()
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
      if (results.status === 'success') {
        this.employeeStatus = []
        if (results.data) {
          results.data.forEach(s => {
            if (s.value != "3") {
              this.employeeStatus.push({
                label: s.name,
                value: s.value
              })
            }
          })
        }
        this.employeeStatus = [{ label: 'Chọn trạng thái', value: -1 }, ...this.employeeStatus];
      }
    })
  }
  organizeList = []
  onNodeSelect(event) {
    // this.detailOrganizeMap = event.node;
    // localStorage.setItem('organize', JSON.stringify(event.node));
    // // this.query.orgId = this.selectedNode?.orgId;
    // this.query.orgId = this.detailOrganizeMap?.orgId;
    // this.isHrDiagram = false;

    // this.load()
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
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

  export() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.setEmployeeExport(queryParams)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(
      (results: any) => {

        if (results.type === 'application/json') {
          this.spinner.hide();
        } else if (results.type === 'application/octet-stream') {
          var blob = new Blob([results], { type: 'application/msword' });
          FileSaver.saveAs(blob, `Danh sách hồ sơ nhân sự` + ".xlsx");
          this.spinner.hide();
        }
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
  changeOrganization() {
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
    this.apiService.getOrganizations(queryParams)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
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
    // const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
    // this.apiService.getOrganizeTree(queryParams)
    //   .subscribe((results: any) => {
    //     if (results && results.status === 'success') {
    //       this.departmentFiltes = results.data;
    //     }
    //   },
    //     error => { });
    // this.queryStaffToMove.orgId = '';
    // this.aDepartment = '';
    // if(this.organizeId && this.queryStaffToMove.orgId){
    //   this.isButtonmoveOrganNow = false;
    // }
    // else {
    //   this.isButtonmoveOrganNow = true;
    // }
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
    if (this.organizeId && this.queryStaffToMove.orgId) {
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
      this.apiService.setListEmployeeChange(this.queryStaffToMove)
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe(results => {
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
    if (data[0] && data[0].emp_st === 0) {
      this.listDataSelect = data
    } else {
      this.listDataSelect = [];
    }
  }

  getCompany() {
    // const query = { organizeIds: this.query.organizeIds}
    // this.apiService.getUserCompanies(queryString.stringify(query))
    //   (results: any) => {
    //     if(results.status === "success"){
    //       this.companies = results.data
    //         .map(d => {
    //           return {
    //             label: d.name,
    //             value: d.value
    //           };
    //         });
    //         if(this.companies.length > 0) {
    //           this.query.companyIds = this.companies[0].value
    //         }
    //         this.load();
    //     }
    //   }),
    //   error => { };
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 20;
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

  import() {
    this.router.navigate(['/nhan-su/ho-so-nhan-su/import']);
  }

  ngAfterContentChecked(): void {

    this.changeDetector.detectChanges();
  }
  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];

  getEmpFilter() {
    this.apiService.getEmpFilter()
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params = getParamString(listViews)
        this.query = { ...this.query, ...params };
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

  filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
  }
  isShow = true;
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

  displayApproveContract = false;
  modelBlockAndOpen = {
    empId: null,
    workDt: null,
    comments: null,
    type: 'open'
  }

  submit() {
    let params = {...this.modelBlockAndOpen};
    delete params.type
    if(this.modelBlockAndOpen.type === 'open') {
      this.apiService.setEmployeeOpenV2(params)
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Mở chặn thành công' });
          this.load();
          this.displayApproveContract = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        }
      });
    }else {
      this.apiService.setEmployeeBlockV2(params)
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Chặn thành công' });
          this.load();
          this.displayApproveContract = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        }
      });
    }

  }

}
