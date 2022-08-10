import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import * as queryString from 'querystring';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cai-dat-lich-hop',
  templateUrl: './cai-dat-lich-hop.component.html',
  styleUrls: ['./cai-dat-lich-hop.component.scss']
})
export class CaiDatLichHopComponent implements OnInit {
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  loading = false;
  columnDefs;
  detailRowHeight;
  defaultColDef;
  detailEmployee;
  frameworkComponents;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  cards = [];
  first = 0;
  model;
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
  showDeleteTax = false;
  showImportExcel = false;
  constructor(
    private apiService: ApiHrmService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
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
  items = [];
  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách quản lý lịch họp' },
    ];
    this.load();
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

  initFilter(): void {
    this.model = {
      filter: '',
      gridWidth: '',
      offSet: 0,
      pageSize: 15
    };
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
    const queryParams = queryString.stringify(this.model);
    this.apiService.getMeetingPage(queryParams).subscribe(
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
          onClick: this.handleEdit.bind(this),
          label: 'Sửa',
          icon: 'fa fa-pencil-square-o',
          class: 'btn-primary mr5',
          hide: (event.data.status === 3)
        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-danger mr5',
          hide: (event.data.status === 3)
        },
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

  handleDelete(e): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa không?',
      accept: () => {
        this.apiService.delMeetingInfo(e.rowData.meet_ud)
          .subscribe(response => {
            if (response.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Xóa thành công` });
              this.load();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
            }
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
          });
      }
    });
  }

  manageBuilding(): void {
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/danh-sach-phong-hop']);
  }

  handleEdit(e): void {
    const params = {
      meet_ud: e.rowData.meet_ud
    }
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/chi-tiet-lich-hop'], { queryParams: params });
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
    const params = {
      meet_ud: ''
    }
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/them-moi-lich-hop'], { queryParams: params });
  }

  importSuccess(): void {
    this.load();
    this.showImportExcel = false;
  }
}

