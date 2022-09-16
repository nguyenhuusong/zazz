import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-tab-bang-luong',
  templateUrl: './tab-bang-luong.component.html',
  styleUrls: ['./tab-bang-luong.component.scss']
})
export class TabBangLuongComponent implements OnInit {
  
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
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  modelTM: any = {};
  itemsToolOfGrid: any[] = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {

    }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
    orgId: 0,
    isLock: -1,
    isApprove: -1,
    emp_st: -1
  }

  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      orgId: 0,
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


  load() {
    
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
          label: 'Xem chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Cấu trúc bảng lương',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Công thức tính lương',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Sửa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }



  editRow(event) {

  }

  initGrid() {
    
  }

  deleteRow(event) {
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
      { label: 'Lương - thuế' },
    ];
    this.getEmployeeStatus();
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        command: () => {
          // this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          this.exportExel();
        }
      },
    ]
    this.columnDefs = [
      {
        headerName: 'STT',
        filter: '',
        maxWidth: 90,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
      },
      {
        headerName: 'Mã chỉ tiêu',
        filter: '',
        cellClass: ['border-right'],
        field: 'code',
      },
      {
        headerName: 'Tên chỉ tiêu',
        filter: '',
        cellClass: ['border-right'],
        field: 'code2',
      },
      {
        headerName: 'Loại chỉ tiêu',
        filter: '',
        cellClass: ['border-right'],
        field: 'code3',
      },
      {
        headerName: '...',
        filter: '',
        maxWidth: 64,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right cell-action', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }
    ]
    
    this.listsData = [
      {
        code: 'Mã NV',
        code2: 'Họ và tên',
        code3: 'Mã công ty',
      },
      {
        code: 'Mã NV',
        code2: 'Họ và tên',
        code3: 'Mã công ty',
      }
    ]
    // this.load();
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
        this.employeeStatus = [{ label: '---Chọn mã chỉ tiêu---', value: -1 }, ...this.employeeStatus];
      }
    })
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

  loadjs = 0;
  heightGrid = 300
  // ngAfterViewChecked(): void {
  //   const a: any = document.querySelector(".header");
  //   const b: any = document.querySelector(".sidebarBody");
  //   const c: any = document.querySelector(".bread-filter");
  //   const d: any = document.querySelector(".bread-crumb");
  //   const e: any = document.querySelector(".paginator");
  //   this.loadjs++
  //   if (this.loadjs === 5) {
  //     if (b && b.clientHeight) {
  //       const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
  //       this.heightGrid = window.innerHeight - totalHeight
  //       this.changeDetector.detectChanges();
  //     } else {
  //       this.loadjs = 0;
  //     }
  //   }
  // }

}