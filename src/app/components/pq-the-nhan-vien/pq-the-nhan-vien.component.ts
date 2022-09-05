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
    { label: 'Tất cả', value: -1 },
    { label: 'Mới tạo', value: 0 },
    { label: 'Hoạt động', value: 1 },
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
  itemsToolOfGrid: any[] = [];
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
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Phân quyền' },
      { label: 'Danh sách thẻ nhân viên' },
    ];
    this.load();
    this.getOrganize();
    this.getPositionList();
    this.getWorkplaces();
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          this.exportexcel();
        }
      },
    ]
  }

  initFilter(): void {
    this.model = {
      organizeId: '',
      orgId: '',
      filter: '',
      positionCd: '',
      workplaceId: '',
      status: -1,
      offSet: 0,
      pageSize: 15
    };
  }

  handleChangeOrganize(): void {
    this.model.orgId = '';
    this.getOrganizeTree();
    // this.find();
  }

  exportexcel(): void {
    this.spinner.show();
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
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách thẻ nhân viên - ' + new Date());
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
  }

  importFileExel() {
    this.router.navigate(['/phan-quyen/the-nhan-vien/import']);
  }


	displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const query = { ...this.model };
    query.organizeId = query.organizeId;
    query.orgId = typeof query.orgId === 'string' ? query.orgId : query.orgId.orgId;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeCardPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.model.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.model.offSet = 0 :  this.model.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.model.offSet) > this.model.pageSize) {
          this.countRecord.currentRecordEnd = this.model.offSet + Number(this.model.pageSize);
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
        },
        {
          onClick: this.deleteCard.bind(this),
          label: 'Xóa thẻ',
          icon: 'fa fa-trash',
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

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.model.organizeId});
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  dataPositionList = []
  getPositionList() {
    const queryParams = queryString.stringify({ objKey: 'positiontype_group' });
    this.apiService.getCustObjectListNew(false, queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.dataPositionList = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
      }
    })
  }

  workplaceOptions = []
  getWorkplaces() {
    this.apiService.getWorkplaces().subscribe(results => {
      if (results.status === 'success') {
        this.workplaceOptions = results.data.map(d => {
          return {
            label: d.workplaceName,
            value: d.workplaceId
          }
        });
      }
    })
  }

  lockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Khóa thẻ này?',
      accept: () => {
     this.spinner.show();
        this.apiService.lockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });

  }

  handlerError(error): void {
    console.log(error);
    this.spinner.hide();
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
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

  unlockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa thẻ này?',
      accept: () => {
        this.spinner.show();
        this.apiService.unlockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });
  }

  deleteCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa thẻ xe này?',
      accept: () => {
       this.spinner.show();
       const queryParams = queryString.stringify({ cardCd: event.rowData.cardCd});
        this.apiService.deleteCard(queryParams)
          .subscribe(results => {
            this.load();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xóa thẻ xe thành công' });
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
    // this.displaythenv = true;
    const params = {
      canId: null
    }
    this.router.navigate(['/phan-quyen/the-nhan-vien/them-moi-the-nhan-vien'], { queryParams: params });
  }

  onChangeTree(a): void {
    // this.find();
  }
}

