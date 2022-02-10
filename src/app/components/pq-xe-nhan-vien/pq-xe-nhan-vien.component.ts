import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn, stringtodate } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { Vehicle, VehicleType } from 'src/app/models/cardinfo.model';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jQuery: any;

@Component({
  selector: 'app-pq-xe-nhan-vien',
  templateUrl: './pq-xe-nhan-vien.component.html',
  styleUrls: ['./pq-xe-nhan-vien.component.scss']
})
export class PqXeNhanVienComponent implements OnInit {
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {
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
  }
  items: Vehicle[] = [];
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
  modelTM: any = {};
  showVehicleCard = false;
  modelApprove: any = {};
  show = false;
  vehicleTypes: VehicleType[] = [];
  departmentList = [];
  listEmployees = [];
  displayVehicleApprove = false;
  listStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Chờ phê duyệt', value: 0 },
    { label: 'Đang hoạt động', value: 1 },
    { label: 'Khóa thẻ', value: 3 },
  ];
  cusId = null;
  first = 0;
  model: any = {
    organizationCd: '',
    filter: '',
    status: -1,
    offSet: 0,
    pageSize: 15
  };
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  displayCreateVehicleCard = false;
  gridColumnApi;
  pagingComponent = {
    total: 0
  };
  loading = false;
  results = [];
  departmentFiltes = [];
  organizes = [];
  itemsBreadcrumb = [];
  ngOnInit(): void {
    this.itemsBreadcrumb = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Phân quyền' },
      { label: 'Danh sách xe nhân viên' },
    ];
    this.model = {
      organizationCd: '',
      org_id: '',
      filter: '',
      status: -1,
      offSet: 0,
      pageSize: 15
    };
    this.loadVehicelTypes();
    this.getOrganize();
    this.load();
  }

  handleChangeOrganize(): void {
    this.model.org_id = '';
    this.getOrganizeTree();
    this.find();
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
          this.organizes = [{ label: 'Tất cả', value: '' }, ...this.organizes];
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

  onChangeTree(a): void {
    this.find();
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const query = { ...this.model };
    query.organizationCd = typeof query.organizationCd === 'string' ? query.organizationCd : query.organizationCd.org_cd;
    query.org_id = typeof query.org_id === 'string' ? query.org_id : query.org_id.org_id;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeVehiclePage(queryParams).subscribe(
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
          onClick: this.addVehicleApprove.bind(this),
          label: 'Phê duyệt',
          icon: 'fa fa-thumbs-up',
          class: 'btn-primary mr5',
          hide: event.data.statusId !== 0
        },
        {
          onClick: this.editVehicleCard.bind(this),
          label: 'Sửa xe',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteCardVehicle.bind(this),
          label: 'Xóa xe',
          icon: 'pi pi-trash',
          class: 'btn-danger mr5',
        },
        {
          onClick: this.lockCardVehicle.bind(this),
          label: 'Khóa',
          icon: 'fa fa-lock',
          class: 'btn-primary mr5',
          hide: event.data.statusId !== 1
        },
        {
          onClick: this.unlockCardVehicle.bind(this),
          label: 'Mở khóa',
          icon: 'fa fa-unlock',
          class: 'btn-primary mr5',
          hide: event.data.statusId !== 3
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

  search(event, type = 'add'): void {
    const params = {
      filter: event.query,
      departmentCd: '',
      isUser: -1,
      isApprove: -1,
      intVehicle: 0,
      isLock: -1,
      offSet: null,
      pageSize: null
    };
    const queryParams = queryString.stringify(params);
    this.apiService.getEmployeeList(queryParams).subscribe((repo: any) => {
      this.results = repo.data;
      if (type === 'edit') {
        const objcusId = this.results.filter(d => d.custId === this.modelTM.cusId);
        this.cusId = objcusId.length > 0 ? objcusId[0] : null;
      }
    });
  }

  onSelectCus(event): void {
    this.modelTM.cusId = event.custId;
    // this.getOwnInfo(event.cif_No);
  }

  checkEnddate(isSend): void {
    this.show = !isSend;
    if (this.show === false) {
      this.modelApprove.endTime = '';
    } else {
      this.modelApprove.endTime = new Date('01/01/2030');
    }
  }

  handlerError(error): void {
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
  }
  datetostring(date): string {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
  }

  editVehicleCard(event): void {
    const cardVehicleId = event.rowData.cardVehicleId;
      if (cardVehicleId === null || cardVehicleId === 0) {
        alert('Cần phê duyệt');
      } else {
        this.apiService.getCardVehicleDetail(cardVehicleId).subscribe(
          (results: any) => {
            this.modelTM.type = 2;
            this.modelTM.cardVehicleId = results.data.cardVehicleId;
            this.modelTM.vehicleNoTM = results.data.vehicleNo;
            this.modelTM.vehicleNameTM = results.data.vehicleName;
            this.modelTM.vehicleTypeIdTM = results.data.vehicleTypeId;
            this.modelTM.vehiclecardCd = results.data.cardCd;
            this.modelTM.startTimeTM = stringtodate(results.data.startTime);
            this.modelTM.endTimeTM = results.data.endTime ? stringtodate(results.data.endTime) : '';
            this.showVehicleCard = this.modelTM.endTimeTM ? true : false;
            this.displayCreateVehicleCard = true;
            this.modelTM.cusId = results.data.custId;
            this.search({ query: results.data.fullName }, 'edit');
            // this.show_dialogcreate = true;
          }, error => this.handlerError(error));
      }

  }

  SaveVehicleCard(): void {
    this.apiService.setCardVehicle(this.modelTM.cardVehicleId, this.modelTM.vehiclecardCd,
      this.modelTM.vehicleTypeIdTM, this.modelTM.vehicleNoTM, this.modelTM.vehicleNameTM,
      this.datetostring(this.modelTM.startTimeTM), this.datetostring(this.modelTM.endTimeTM), this.modelTM.cusId).subscribe(results => {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật vé xe thành công' });
        this.displayCreateVehicleCard = false;
        this.load();
      }, error => { });
    // this.loadCardVip(this.model.custId);

  }
  addVehicleApprove(event): void {
    this.modelApprove.cardCd = '';
    this.modelApprove.cardVehicleId = event.rowData.cardVehicleId;
    this.modelApprove.endTime = new Date();
    this.displayVehicleApprove = true;

  }

  SaveVehicleApprove(): void {
    const dataSave = { cardVehicleId: this.modelApprove.cardVehicleId, cardCd: this.modelApprove.cardCd, endTime: '' };
    if (this.show) {
      dataSave.endTime = this.datetostring(this.modelApprove.endTime);
    }
    this.apiService.setVehicleApprove(dataSave).
      subscribe((response: any) => {
        if (response.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Phê duyệt vé xe thành công' });
          this.displayVehicleApprove = false;
          this.load();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message || 'Phê duyệt vé xe thất bại' });
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Phê duyệt vé xe thất bại' });
        console.error(error);
      });
  }

  lockCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Khóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.lockCardVehicle(event.rowData.cardVehicleId)
          .subscribe(results => {
            this.load();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa dịch vụ gửi xe thành công' });
          }, error => this.handlerError(error));
      }
    });
  }

  approveCardVehicle(event): void {
    this.apiService.approveCardVehicle(event.rowData.cardVehicleId).then(results => {
      this.load();
    }, error => this.handlerError(error));
  }

  unlockCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.unlockCardVehicle(event.rowData.cardVehicleId)
          .subscribe(results => {
            this.load();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa dịch vụ gửi xe thành công' });
          }, error => this.handlerError(error));
      }
    });

  }

  deleteCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.setVehicleRemove({ cardVehicleId: event.rowData.cardVehicleId })
          .subscribe(response => {
            if (response.status === 'success') {
              this.load();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xóa dịch vụ xe thành công' });
            } else {
              this.messageService.add({
                severity: 'error', summary: 'Thông báo',
                detail: response.message || 'Xóa dịch vụ gửi xe thất bại'
              });
            }
          }, error => {
            this.handlerError(error);
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xóa dịch vụ gửi xe thất bại' });
          });
      }
    });
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

  loadVehicelTypes(): void {
    this.apiService.getVehicleTypes().subscribe(
      (results: any) => {
        this.vehicleTypes = results.data;
        // this.loadCardVip(this.model.custId);
      },
      error => { });
  }

  find(): void {
    this.load();
  }

  cancel(): void {
    this.model.filter = '';
    this.model.status = -1;
    this.model.departmentCd = '';
    this.load();
  }

  addVehicleCard(): void {
    this.modelTM.type = 1;
    this.modelTM.cardVehicleId = 0;
    this.modelTM.vehicleNoTM = '';
    this.modelTM.vehicleNameTM = '';
    this.modelTM.vehicleTypeIdTM = 1;
    this.modelTM.vehiclecardCd = this.model.cardCd;
    this.modelTM.startTimeTM = new Date();
    this.modelTM.endTimeTM = new Date();
    this.modelTM.cusId = '';
    this.displayCreateVehicleCard = true;
  }

  checkEnddateVehicleCard(isSend): void {
    this.showVehicleCard = !isSend;
    if (this.showVehicleCard === false) {
      this.modelTM.endTimeTM = '';
    } else {
      this.modelTM.endTimeTM = new Date('01/01/2030');
    }
  }

  changePageSize(): void {
    this.load();
  }
}

