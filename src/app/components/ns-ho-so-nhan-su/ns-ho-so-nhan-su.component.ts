import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-ns-ho-so-nhan-su',
  templateUrl: './ns-ho-so-nhan-su.component.html',
  styleUrls: ['./ns-ho-so-nhan-su.component.scss']
})
export class NsHoSoNhanSuComponent implements OnInit {
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
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
    org_id: 0,
    isLock: -1,
    isApprove: -1,
    emp_st: -1
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

  onmouseenter(event) {
    console.log(event)
  }
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      org_id: 0,
      isLock: -1,
      isApprove: -1,
      emp_st: -1
    }
    this.load();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAgencyOrganizeMap() {
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          this.query.org_id = this.selectedNode.org_id;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          this.query.org_id = this.selectedNode.org_id;
          this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parent_id)
          this.selected(this.listAgencyMap, this.query.org_id)
          this.load();
        }
      }
    })
  }


  expanded(datas = [], org_id = 0) {
    datas.forEach(d => {
      if (d.org_id === org_id) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parent_id)
      }
    })
    return datas
  }

  selected(datas = [], org_id = 0) {
    datas.forEach(d => {
      if (d.org_id === org_id) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.org_id)
      }
    }
    )
  }

  themnhanvien() {
    const params = {
      employeeId: 0
    }
    this.router.navigate(['/ho-so-nhan-su/them-moi-nhan-vien'], { queryParams: params });
  }


  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getEmployeePage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
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
          onClick: this.EditEmployee.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.xoanhanvien.bind(this),
          label: 'Xóa nhân viên này',
          icon: 'fa fa-trash',
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
      message: 'Bạn có chắc chắn muốn thực hiện mở tài khoản?',
      accept: () => {
        this.apiService.deleteEmployee(event.rowData.employeeId).subscribe((results: any) => {
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
          employeeId: event.rowData.employeeId
        })
      },
      reject: () => {
        this.setEmployeeClose({
          employeeId: event.rowData.employeeId
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
          employeeId: event.rowData.employeeId,
          status: true
        })
      },
      reject: () => {
        this.setAccountStatus({
          employeeId: event.rowData.employeeId,
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
      employeeId: event.rowData.employeeId
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
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Nhân sự' },
      { label: 'Danh sách hồ sơ nhân sự' },
    ];
    this.getAgencyOrganizeMap();
    this.getEmployeeStatus();
  }
  employeeStatus = []
  getEmployeeStatus() {
    this.apiService.getEmployeeStatus().subscribe(results => {
      if (results.status === 'success') {
        this.employeeStatus = results.data.map(d => {
          return {
            label: d.name,
            value: d.value
          }
        });
        this.employeeStatus = [{ label: 'Tất cả', value: -1 }, ...this.employeeStatus];
      }
    })
  }
  organizeList = []
  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    localStorage.setItem('organize', JSON.stringify(event.node));
    this.query.org_id = this.selectedNode.org_id;
    this.query.org_id = this.detailOrganizeMap.org_id;
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

}
