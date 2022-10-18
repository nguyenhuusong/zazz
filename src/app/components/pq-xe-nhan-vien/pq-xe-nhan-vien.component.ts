import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn, CheckHideAction, stringtodate } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { Vehicle, VehicleType } from 'src/app/models/cardinfo.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
declare var jQuery: any;

@Component({
  selector: 'app-pq-xe-nhan-vien',
  templateUrl: './pq-xe-nhan-vien.component.html',
  styleUrls: ['./pq-xe-nhan-vien.component.scss']
})
export class PqXeNhanVienComponent implements OnInit {
  public modules: Module[] = AllModules;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  public agGridFn = AgGridFn;
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private fileService: ExportFileService,
    private organizeInfoService: OrganizeInfoService,
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
  imageLinksCard = [
    {
      cardVehicleId: null,
      id: null,
      type: "LICENSE",
      url: '',
    },
    {
      cardVehicleId: null,
      id: null,
      type: "LICENSE",
      url: '',
    },
    {
      cardVehicleId: null,
      id: null,
      type: "LICENSE_PLATE",
      url: '',
    },
  ]
  listStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Mới tạo', value: 0 },
    { label: 'Hoạt động', value: 1 },
    { label: 'Khóa thẻ', value: 3 },
  ];
  cusId = null;
  first = 0;
  model: any = {
    organizeId: '',
    workplaceId: '',
    positionCd: '',
    orgId: '',
    filter: '',
    status: -1,
    offSet: 0,
    pageSize: 15,
    organizeIds: '',
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
  itemsToolOfGrid: any[] = [];
  ngOnInit(): void {
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.model.organizeIds = results;
          this.model.organizeId = results;
          this.load();
          this.getOrganizeTree();
        }
    });
    this.itemsBreadcrumb = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Phân quyền' },
      { label: 'Danh sách xe nhân viên' },
    ];
    this.model = {
      organizeId: '',
      orgId: '',
      filter: '',
      status: -1,
      offSet: 0,
      pageSize: 15
    };
    this.loadVehicelTypes();
    this.getOrganize();
    this.load();
    this.getPositionList();
    this.getWorkplaces();
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.IMPORT),
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.EXPORT),
        command: () => {
          this.exportExel();
        }
      },
    ]
  }
  
  onChangeUser(event) {
    this.GetHrmCardByCustId();
  }

  handleChangeOrganize(): void {
    this.model.orgId = '';
    this.getOrganizeTree();
    this.find();
  }
  organizesAdds = [];
  getOrganize(): void {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams)
      .subscribe(
        (results: any) => {
          this.organizes = results.data
            .map(d => {
              return {
                label: d.organizationName || d.organizationCd,
                value: d.organizeId,
                ...d
              };
            });
          this.organizesAdds = results.data
            .map(d => {
              return {
                label: d.organizationName || d.organizationCd,
                value: d.organizeId,
                ...d
              };
            });
          this.modelTM.organizeId = this.organizesAdds[0].value;
          this.getUserByPush();
          this.organizes = [{ label: 'Tất cả', value: '' }, ...this.organizes];

        }),
      error => { };
  }

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.model.organizeIds });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  onChangeTree(a): void {
    this.load();
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
    // query.organizeId = typeof query.organizeId === 'string' ? query.organizeId : query.organizeId.org_cd;
    query.orgId = typeof query.orgId === 'string' ? query.orgId : query.orgId.orgId;
    console.log('query.orgId', query.orgId)
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeVehiclePage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.model.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.model.offSet = 0 : this.model.offSet + 1;
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
          onClick: this.addVehicleApprove.bind(this),
          label: 'Phê duyệt',
          icon: 'fa fa-thumbs-up',
          class: 'btn-primary mr5',
          hide: this.CheckHideApprove(event)
        },
        {
          onClick: this.editVehicleCard.bind(this),
          label: 'Sửa xe',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.deleteCardVehicle.bind(this),
          label: 'Xóa xe',
          icon: 'pi pi-trash',
          class: 'btn-danger mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.DELETE)
        },
        {
          onClick: this.lockCardVehicle.bind(this),
          label: 'Khóa',
          icon: 'fa fa-lock',
          class: 'btn-primary mr5',
          hide: this.CheckHideLock(event)
        },
        {
          onClick: this.unlockCardVehicle.bind(this),
          label: 'Mở khóa',
          icon: 'fa fa-unlock',
          class: 'btn-primary mr5',
          hide: this.CheckHideUnLock(event)
        },
      ]
    };
  }
  CheckHideUnLock(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.KHOA_XE);
    if(checkValue) {
      return true;
    }else {
      if(event.data.statusId !== 3) {
        return true;
      }else {
        return false;
      }
    }
  }
  CheckHideLock(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.MO_KHOA_XE);
    if(checkValue) {
      return true;
    }else {
      if(event.data.statusId !== 1) {
        return true;
      }else {
        return false;
      }
    }
  }
  CheckHideApprove(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeVehiclePage.url, ACTIONS.PHE_DUYET);
    if(checkValue) {
      return true;
    }else {
      if(event.data.statusId !== 0) {
        return true;
      }else {
        return false;
      }
    }
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

  // editVehicleCard(event): void {
  //   const cardVehicleId = event.rowData.cardVehicleId;
  //   if (cardVehicleId === null || cardVehicleId === 0) {
  //     alert('Cần phê duyệt');
  //   } else {
  //     this.apiService.getCardVehicleDetail(cardVehicleId).subscribe(
  //       (results: any) => {
  //         this.modelTM.type = 2;
  //         this.modelTM.cardVehicleId = results.data.cardVehicleId;
  //         this.modelTM.vehicleNoTM = results.data.vehicleNo;
  //         this.modelTM.organizeId = event.rowData.organizeId;
  //         this.modelTM.vehicleNameTM = results.data.vehicleName;
  //         this.modelTM.vehicleTypeIdTM = results.data.vehicleTypeId;
  //         this.modelTM.vehiclecardCd = results.data.cardCd;
  //         this.modelTM.startTimeTM = stringtodate(results.data.startTime);
  //         this.modelTM.endTimeTM = results.data.endTime ? stringtodate(results.data.endTime) : '';
  //         this.showVehicleCard = this.modelTM.endTimeTM ? true : false;
  //         this.displayCreateVehicleCard = true;
  //         this.modelTM.cusId = event.rowData.custId;
  //         this.getUserByPush();
  //         old --- this.search({ query: results.data.fullName }, 'edit');
  //         old --- this.show_dialogcreate = true;
  //       }, error => this.handlerError(error));
  //   }

  // }

  editVehicleCard(event): void {
    console.log('event event event event', event)
    const cardVehicleId = event.rowData.cardVehicleId;
    this.modelTM.imageLinks = cloneDeep(this.imageLinksCard);
    if (cardVehicleId === null || cardVehicleId === 0) {
      alert('Cần phê duyệt');
    } else {
      this.apiService.getDetailEmployeeVehicleInfo(cardVehicleId).subscribe(
        (results: any) => {
          this.modelTM.type = 2;
          this.modelTM.cardVehicleId = results.data.cardVehicleId;
          this.modelTM.vehicleNoTM = results.data.vehicleNo;
          this.modelTM.organizeId = event.rowData.organizeId;
          this.modelTM.vehicleNameTM = results.data.vehicleName;
          this.modelTM.vehicleTypeIdTM = results.data.vehicleTypeId;
          this.modelTM.vehiclecardCd = results.data.cardId;
          this.modelTM.startTimeTM = stringtodate(results.data.startTime);
          this.modelTM.endTimeTM = results.data.endTime ? stringtodate(results.data.endTime) : '';
          this.showVehicleCard = this.modelTM.endTimeTM ? true : false;
          this.displayCreateVehicleCard = true;
          this.modelTM.noteTM = results.data.note;
          this.modelTM.vehicleColorTM = results.data.vehicleColor;
          this.imageLinksCard[0].cardVehicleId = this.modelTM.cardVehicleId;
          this.imageLinksCard[1].cardVehicleId = this.modelTM.cardVehicleId;
          this.imageLinksCard[2].cardVehicleId = this.modelTM.cardVehicleId;
          this.modelTM.cusId = event.rowData.custId;
          // this.modelTM.cardId = results.data.cardId;
          this.getImageUrl(results.data.imageLinks)
          this.getUserByPush();
          this.GetHrmCardByCustId();
          // this.search({ query: results.data.fullName }, 'edit');
          // this.show_dialogcreate = true;
        }, error => this.handlerError(error));
    }

  }


  getImageUrl(datas) {
    if(datas[0]){
      this.modelTM.imageLinks[0] = datas[0]
    }else{
      this.modelTM.imageLinks[0] = this.imageLinksCard[0]
    }
    if(datas[1]){
      this.modelTM.imageLinks[1] = datas[1]
    }else{
      this.modelTM.imageLinks[1] = this.imageLinksCard[1]
    }
    if(datas[2]){
      this.modelTM.imageLinks[2] = datas[2]
    }else{
      this.modelTM.imageLinks[2] = this.imageLinksCard[2]
    }
  }

  multipleImage = true;
  SaveVehicleCard(): void {
    let startTimeTm = null;
    let endTimeTm = null;
    if (this.modelTM.endTimeTM === '') {
      startTimeTm = null;
      endTimeTm = null;
    } else {
      startTimeTm = this.datetostring(this.modelTM.startTimeTM);
      endTimeTm = this.datetostring(this.modelTM.endTimeTM);
    }
    
    if(!this.modelTM.imageLinks[0].url || !this.modelTM.imageLinks[1].url || !this.modelTM.imageLinks[2].url){
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng upload ảnh' });
      return;
    }
    
      this.apiService.setCardVehicle(this.modelTM.cardVehicleId, null,
        this.modelTM.vehicleTypeIdTM, this.modelTM.vehicleNoTM, this.modelTM.vehicleColorTM, this.modelTM.vehicleNameTM,
        startTimeTm, endTimeTm, this.modelTM.noteTM, this.modelTM.cusId, this.modelTM.imageLinks).subscribe((results: any) => {
          if (results.status === 'error') {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật vé xe thành công' });
            this.displayCreateVehicleCard = false;
            this.load();
          }
        }, error => { });
        // if(this.imageLinksCard[0].url && this.imageLinksCard[1].url && this.imageLinksCard[2].url) {
      // }
      // else{
      // this.displayCreateVehicleCard = false;
      //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng cập nhật ảnh' });
      // }
    // this.loadCardVip(this.model.custId);

  }

  listCard = []
  GetHrmCardByCustId() {
    const queryParam = queryString.stringify({ custId: this.modelTM.cusId })
    this.apiService.getHrmCardByCustId(queryParam).subscribe((results : any) => {
      if(results.status === 'success') {
        this.listCard = results.data.map( d => { 
          return  { label: d.cardCd, value: d.cardId }
        })
      }
    }, error => this.handlerError(error));
  }
  uploadImageVehicle(event, index) {
    if (event.currentFiles.length > 0) {
      for (let file of event.currentFiles) {
        const getDAte = new Date();
        const getTime = getDAte.getTime();
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`s-hrm/file-attach/${getTime}-${file.name}`).put(file);
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.message });
          this.spinner.hide();
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (downloadURL) {
              this.spinner.hide();
              if(this.modelTM.imageLinks[index]){
                this.modelTM.imageLinks[index].url = downloadURL;
              }
            }
          });
        });
      }
    }
    else{
      this.spinner.hide();
    }
  }

  deleteImg(index){
    this.modelTM.imageLinks[index].url = '';
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
          .subscribe((results : any) => {
            if(results.status === 'success') {
              this.load();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa dịch vụ gửi xe thành công' });
            }else {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            }
          }, error => this.handlerError(error));
      }
    });
  }

  approveCardVehicle(event): void {
    this.apiService.approveCardVehicle(event.rowData.cardVehicleId).then((results: any) => {
      if(results.status === 'success') {
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thành công' });
      }else {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      }
    }, error => this.handlerError(error));
  }

  unlockCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.unlockCardVehicle(event.rowData.cardVehicleId)
          .subscribe((results: any) => {
            if(results.status === 'success') {
              this.load();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa dịch vụ gửi xe thành công' });
            }else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
            }
           
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
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
    this.changeDetector.detectChanges();
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
    this.model = {
      organizeId: '',
      workplaceId: '',
      positionCd: '',
      orgId: '',
      filter: '',
      status: -1,
      offSet: 0,
      pageSize: 15,
      orgIds: this.model.organizeIds
    };
    this.model.filter = '';
    this.model.status = -1;
    this.model.departmentCd = '';
    this.load();
  }

  addVehicleCard(): void {
    this.modelTM.type = 1;
    this.modelTM.organizeId = this.organizesAdds[0].value;
    this.modelTM.cardVehicleId = 0;
    this.modelTM.vehicleNoTM = '';
    this.modelTM.vehicleNameTM = '';
    this.modelTM.vehicleTypeIdTM = 1;
    this.modelTM.vehiclecardCd = this.model.cardId;
    this.modelTM.startTimeTM = new Date();
    this.modelTM.endTimeTM = new Date();
    this.modelTM.cusId = '';
    this.displayCreateVehicleCard = true;
    this.modelTM.vehicleColorTM = '';
    this.modelTM.noteTM = '';
    this.modelTM.imageLinks = cloneDeep(this.imageLinksCard);
  }

  getEmployeeVehicleInfo() {
    
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

  exportExel() {

    this.spinner.show();
    this.model.pageSize = 1000000;
    const query = { ...this.model };
    query.organizeId = typeof query.organizeId === 'string' ? query.organizeId : query.organizeId.org_cd;
    query.orgId = typeof query.orgId === 'string' ? query.orgId : query.orgId.orgId;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeVehiclePage(queryParams).subscribe((results: any) => {
      const dataExport = [];
      let gridflexs = results.data.gridflexs;
      let arrKey = gridflexs.map(elementName => elementName.columnField);

      let dataList = results.data.dataList.data;
      for (let elementValue of dataList) {
        const data: any = {};
        for (let elementName of gridflexs) {
          if (arrKey.indexOf(elementName.columnField) > -1 && !elementName.isHide && elementName.columnField !== 'statusName') {
            data[elementName.columnCaption] = elementValue[elementName.columnField] || '';
          
          }

        }
        data['Trạng thái'] = elementValue.statusId === 0 ? 'Mới tạo' : elementValue.statusId === 1 ? 'Hoạt động' : 'Khóa thẻ';
        dataExport.push(data);
      }
      this.fileService.exportAsExcelFile(dataExport, 'Danh sách xe nhân viên ' + new Date());

      this.spinner.hide();

    });
  }

  importFileExel() {
    this.router.navigate(['/phan-quyen/xe-nhan-vien/import']);
  }

  listUsers = [];
  getUserByPush() {
    this.spinner.show();
    this.apiService.getUserByPush({ organizeId: this.modelTM.organizeId, orgIds: [this.modelTM.organizeId] }).subscribe(results => {
      if (results.status === 'success') {
        this.listUsers = results.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: d.custId,
            roleName: 'user',
            ...d
          }
        });
      
        this.modelTM.cusId = this.modelTM.cusId ? this.modelTM.cusId : this.listUsers[0].value;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

}

