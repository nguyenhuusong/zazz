import { ApiService } from './../../services/api.service';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as queryString from 'querystring';
import { ExportFileService } from 'src/app/services/export-file.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-cs-thue-thu-nhap',
  templateUrl: './cs-thue-thu-nhap.component.html',
  styleUrls: ['./cs-thue-thu-nhap.component.scss']
})
export class CsThueThuNhapComponent implements OnInit, AfterViewChecked {
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
  cards = [];
  first = 0;
  query;
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  companies = [];
  gridColumnApi;
  pagingComponent = {
    total: 0
  };
  items = [];
  showDeleteTax = false;
  showImportExcel = false;
  constructor(
    private apiService: ApiHrmService,
    private apiBaseService: ApiService,
    private fileService: ExportFileService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách thuế thu nhập' },
    ];
    this.load();
    this.getCompanies();
  }

  initFilter(): void {
    this.query = {
      companyId: '',
      filter: '',
      offSet: 0,
      pageSize: 15
    };
  }

  exportExcel(): void {
    const query = { ...this.query };
    query.offSet = 0;
    query.pageSize = 1000000;
    const queryParams = queryString.stringify(query);
    this.apiService.getIncomeTaxPage(queryParams)
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
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách thu nhập thuế ' + new Date());
      }, error => {
        console.error(error);
      });
  }

  dowloadTemplate() {
    this.apiService.exportReportLocalhost('assets/mau-thue-thu-nhap.xlsx').subscribe((data: any) => {
        this.createImageFromBlob(data)
    });
  }

  createImageFromBlob(image: Blob) {
    var blob = new Blob([image]);
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "mau-thue-thu-nhap.xlsx";
    anchor.href = url;
    anchor.click();
  }

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getIncomeTaxPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
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
          onClick: this.handleEdit.bind(this),
          label: 'Sửa',
          icon: 'fa fa-pencil-square-o',
          class: 'btn-primary mr5',
          // hide: (params.data.status === 3)
        },
        {
          onClick: this.handleExportTax.bind(this),
          label: 'Xuất chứng từ thuế mẫu 1',
          icon: 'fa fa-trash',
          class: 'btn-danger mr5',
          hide: false
        },
        {
          onClick: this.handleExportTax2.bind(this),
          label: 'Xuất chứng từ thuế mẫu 2',
          icon: 'fa fa-trash',
          class: 'btn-danger mr5',
          hide: false
        },
        {
          onClick: this.handleExportApproveTax.bind(this),
          label: 'Xuất thư xác nhận thuế',
          icon: 'fa fa-trash',
          class: 'btn-danger mr5',
          hide: false
        },
      ]
    };
  }
  
  handleExportTax(data) {
    this.spinner.show();
    this.apiBaseService.getCTThueThuNhapCN(data.rowData.id, 1)
    .subscribe(response => {
      var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Chứng từ thuế mẫu 1' + ".xlsx");
      this.spinner.hide();
    })
  }

  handleExportTax2(data) {
    this.spinner.show();
    this.apiBaseService.getCTThueThuNhapCN(data.rowData.id, 2)
    .subscribe(response => {
      var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Chứng từ thuế mẫu 2' + ".xlsx");
      this.spinner.hide();
    })
  }

  handleExportApproveTax(data) {
  this.spinner.show();
    this.apiBaseService.getThuXacNhanThuNhaptype(data.rowData.id)
    .subscribe(response => {
      var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Thư xác nhận thuế' + ".xlsx");
      this.spinner.hide();
    })
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

  // handleDelete(e): void {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có chắc chắn muốn xóa không?',
  //     accept: () => {
  //       this.apiService.deleteIncomeTaxStatus(e.rowData.id)
  //         .subscribe(response => {
  //           if (response.status === 'success') {
  //             this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Xóa thành công` });
  //           } else {
  //             this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
  //           }
  //         }, error => {
  //           this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
  //         });
  //     }
  //   });
  // }


  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + e.clientHeight + 15;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  handleEdit(e): void {
    this.router.navigate(['/chinh-sach/thue-thu-nhap/chi-tiet-thue-thu-nhap'], { queryParams: {id: e.rowData.id} })
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  paginate(event): void {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  getCompanies(): void {
    const queryParams = queryString.stringify({});
    this.apiService.getCompanyList(queryParams)
      .subscribe((results: any) => {
        this.companies = results.data
          .map(d => {
            return { label: d.companyName, value: d.companyId };
          });
        this.companies = [{ label: 'Tất cả', value: '' }, ...this.companies];
      });
  }

  handlerError(error): void {
    console.log(error);
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
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

  handleAdd(): void {
    this.router.navigateByUrl('/chinh-sach/bao-cao-thue/create');
  }

  importSuccess(): void {
    this.load();
    this.showImportExcel = false;
  }

  handleDelete(): void {
    this.showDeleteTax = true;
  }
}

