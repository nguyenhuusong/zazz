import { Router } from '@angular/router';
import { ApiService } from './../../../services/api.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as queryString from 'querystring';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';

@Component({
  selector: 'app-danh-sach-phong-hop',
  templateUrl: './danh-sach-phong-hop.component.html',
  styleUrls: ['./danh-sach-phong-hop.component.scss']
})
export class DanhSachPhongHopComponent implements OnInit {
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

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
  model = {
    filter: '',
    gridWidth: '',
    offSet: 0,
    pageSize: 15,
    floor_No: '',
    workplaceId: '',
    roomId: '',
    status_meet: '',
    orgIds: '',
  };
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

  statusRoom = [
    {
      label: 'Đang trống',
      value: "Đang trống",
    },
    {
      label: 'Đang họp',
      value: "Đang họp"
    },
    {
      label: 'Sắp họp',
      value: "Sắp họp"
    }
  ]
  constructor(
    private apiService: ApiHrmService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
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
    this.model.orgIds = localStorage.getItem("organizes");
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.model.orgIds = results;
          this.load();
        }
    });
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Hoạt động' },
      { label: 'Lịch họp', routerLink: '/hoat-dong/lich-hop' },
      { label: 'Quản lý phòng họp'},
    ];
    this.getFloor();
  }

  initFilter(): void {
    this.model = {
      filter: '',
      gridWidth: '',
      offSet: 0,
      pageSize: 15,
      floor_No: '',
      workplaceId: '',
      roomId: '',
      status_meet: '',
      orgIds: localStorage.getItem("organizes")
    };
  }

  
  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
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
    this.apiService.getMeetRoomPage(queryParams).subscribe(
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

  floors = []
  getFloor() {
    this.apiService.getFloorNo().subscribe(results => {
      if (results.status === 'success') {
        this.floors = (results.data).map(d => {
          return { 
            label: 'Tầng' + ' ' + d.floorNo, 
            value: d.floorNo 
          }
        });
      }
    })
  }

  changeFloor() {
    this.getRooms();
  }

  rooms = []
  getRooms() {
    const queryParams = queryString.stringify( { filter: '', floor_No: this.model.floor_No })
    this.apiService.getMeetRooms(queryParams)
      .subscribe(results => {
        if (results.status === 'success') {
          if(this.model.floor_No){
            this.rooms = results.data.map(d => {
              return {
                label: d.room_name,
                value: d.roomId,
              }
            })  
          }else{
            this.rooms = []
          }
          this.load();
        }
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
          hide: this.CheckHideXem(event)
        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-danger mr5',
          hide: this.CheckHideXoa(event)
        },
      ]
    };
  }

  CheckHideXem(event) {
    if(CheckHideAction(MENUACTIONROLEAPI.GetMeetRoomPage.url, ACTIONS.VIEW)) {
      return true;
    }else {
      if(event.data.status === 3) {
        return true;
      }else {
        return false;
      }
    }
  }
  CheckHideXoa(event) {
    if(CheckHideAction(MENUACTIONROLEAPI.GetMeetRoomPage.url, ACTIONS.DELETE)) {
      return true;
    }else {
      if(event.data.status === 3) {
        return true;
      }else {
        return false;
      }
    }
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'STT',
        filter: '',
        maxWidth: 70,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto', 'text-center'],
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.gridflexs.filter((d: any) => !d.isHide)),
      {
        headerName: '   ...',
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

  }

  handleDelete(e): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa không?',
      accept: () => {
        this.apiService.delMeetRoomInfo(e.rowData.roomId)
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


  handleEdit(e): void {
    const params = {
      roomId: e.rowData.roomId
    }
    this.router.navigate(['hoat-dong/lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop'], { queryParams: params });
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
      roomId: ''
    }
    this.router.navigate(['hoat-dong/lich-hop/danh-sach-phong-hop/them-moi-phong-hop'], { queryParams: params });
  }
}

