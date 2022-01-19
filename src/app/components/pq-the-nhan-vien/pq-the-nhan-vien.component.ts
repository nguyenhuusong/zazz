import { NotificationService } from 'src/app/services/notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExportFileService } from 'src/app/services/export-file.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as queryString from 'querystring';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AgGridFn } from 'src/app/common/function-common/common';
import { EmployeeCardList } from 'src/app/models/cardinfo.model';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pq-the-nhan-vien',
  templateUrl: './pq-the-nhan-vien.component.html',
  styleUrls: ['./pq-the-nhan-vien.component.scss']
})
export class PqTheNhanVienComponent implements OnInit {
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  loading = false;
  columnDefs;
  detailRowHeight;
  defaultColDef;
  detailEmployee;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  cards: EmployeeCardList[] = [];
  organizes = [];
  departmentFiltes = [];
  listStatus = [
    { label: 'Lọc theo trạng thái', value: -1 },
    { label: 'Đang hoạt động', value: 1 },
    { label: 'Khóa thẻ', value: 3 },
  ];
  first = 0;
  model;
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  gridColumnApi;
  pagingComponent = {
    total: 0
  };
  constructor(
    private apiService: ApiHrmService,
    private fileService: ExportFileService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 38;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
    };
    this.initFilter();
  }

  items = []
  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' },
      { label: 'Phân quyền' },
      { label: 'Danh sách thẻ nhân viên' },
    ];
    this.load();
    this.getOrganize();
  }

  initFilter(): void {
    this.model = {
      organizationCd: '',
      org_id: '',
      filter: '',
      status: -1,
      offSet: 0,
      pageSize: 15
    };
  }

  handleChangeOrganize(): void {
    this.model.org_id = '';
    this.getOrganizeTree();
    this.find();
  }

  exportexcel(): void {
    const query = { ...this.model };
    query.offSet = 0;
    query.pageSize = 1000000;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeCardPage(queryParams)
      .subscribe((results: any) => {
        const dataExport = [];
        results.data.dataList.data.forEach(element => {
          const data: any = {};
          data['Mã thẻ'] = element.cardCd || '';
          data['Tên nhân viên'] = element.fullName || '';
          data['Tổ chức'] = element.orgName || '';
          data['Phòng'] = element.departmentName || '';
          data['Số điện thoại'] = element.phone || '';
          data['Ngày tạo thẻ'] = element.issueDate || '';
          data['Tài khoản tạo thẻ'] = element.created_by || '';
          data['Trạng thái'] = element.status === 3 ? 'Khóa' : (element.status === 1 ? 'Hoạt động' : '');
          data['Số lượng xe'] = element.countVehicle || '0';
          dataExport.push(data);
        });
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách thẻ xe ' + new Date());
      }, error => {
        console.error(error);
      });
  }


  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const query = { ...this.model };
    query.organizationCd = query.organizationCd.org_cd;
    query.org_id = typeof query.org_id === 'string' ? query.org_id : query.org_id.org_id;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeCardPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.model.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.model.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.model.offSet) > this.model.pageSize) {
          this.countRecord.currentRecordEnd = this.model.offSet + Number(this.model.pageSize);
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
          onClick: this.lockCard.bind(this),
          label: 'Khóa',
          icon: 'fa fa-lock',
          class: 'btn-primary mr5',
          hide: (event.data.status === 3)
        },
        {
          onClick: this.unlockCard.bind(this),
          label: 'Mở khóa',
          icon: 'fa fa-unlock',
          class: 'btn-primary mr5',
          hide: (event.data.status !== 3)
        }
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs.filter((d: any) => !d.isHide)),
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

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  paginate(event): void {
    this.model.offSet = event.first;
    this.first = event.first;
    this.model.pageSize = event.rows;
    this.load();
  }


  getOrganize(): void {
    this.apiService.getOrganizeList('org_level=1')
      .subscribe(
        (results: any) => {
          this.organizes = results.data
            .map(d => {
              return {
                label: d.org_name || d.org_cd,
                value: { org_cd: d.org_cd, org_id: d.org_id }
              };
            });
          // if (this.organizes && this.organizes.length) {
          //   this.model.organizationCd = { org_cd: this.organizes[0].value.org_cd, org_id: this.organizes[0].value.org_id };
          //   this.getOrganizeTree();
          // }
          this.organizes = [{ label: 'Chọn tổ chức', value: '' }, ...this.organizes];
        },
        error => { });
  }

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parent_id: this.model.organizationCd.org_id });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  lockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Khóa thẻ này?',
      accept: () => {
        this.apiService.lockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });

  }

  handlerError(error): void {
    console.log(error);
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
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

  unlockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa thẻ này?',
      accept: () => {
        this.apiService.unlockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });
  }

  find(): void {
    this.load();
  }

  cancel(): void {
    this.initFilter();
    this.load();
  }

  changePageSize(): void {
    this.load();
  }
  displaythenv = false;
  handleAdd(): void {
    this.displaythenv = true;
  }

  onChangeTree(a): void {
    this.find();
  }
}

