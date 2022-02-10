import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Router } from '@angular/router';
import { CardInfo, SearchInfo } from 'src/app/models/cardinfo.model';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { Subject, takeUntil } from 'rxjs';
const queryString = require('query-string');
@Component({
  selector: 'app-pq-thang-may',
  templateUrl: './pq-thang-may.component.html',
  styleUrls: ['./pq-thang-may.component.scss']
})
export class PqThangMayComponent implements OnInit {
  private readonly unsubscribe$: Subject<void> = new Subject();
  public modules: Module[] = AllModules;
  cardinfo: CardInfo;
  items: CardInfo[] = [];
  searchInfo: SearchInfo;
  public gridApi;
  public gridColumnApi;
  public frameworkComponents: any;
  public columnDefs;
  public defaultColDef;
  public getRowHeight;
  public colResizeDefault;
  public rowData: any[] = [];
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  titleModal: string;
  modelCR: any[] = [];
  builds: any[] = [];
  modelCardType: any[] = [];
  modelProject: any[] = [];
  modelBuilding: any[] = [];
  modelFloor: any[] = [];
  listCars: any[] = [];
  floors: any[] = [];
  devices: any[] = [];
  modelElevator = {
    cardCode: '',
    projectCd: '',
    buildZone: '',
    buildCd: '',
    floorNumber: null,
    hardwareId: null,
  }
  modelcar;
  key_car;
  loading = false;
  menuItem = [];
  itemsBreadcrumb = [];
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.searchInfo = new SearchInfo('', '', '');
    this.cardinfo = new CardInfo(0, 0, '', 0, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', null, null, '');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.itemsBreadcrumb = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Phân quyền' },
      { label: 'Phân quyền thang máy' },
    ];
    this.menuItem = [
      {
        label: 'Thiết bị thang máy',
        icon: 'pi pi-refresh',
        command: () => {
          this.thietbithangmay();
        }
      },
      {
        label: 'Tầng thang máy',
        icon: 'pi pi-refresh',
        command: () => {
          this.tangthangmay();
        }
      },

    ]
    this.cardinfo.filter = '';
    // this.pagingComponent.pageSize = 10;
    this.loadElevatorCardRole();
    this.loadCardType();
    this.getProjectCd();
    this.loadGetProjects();
    this.init();
    this.init1();
  }

  thietbithangmay() {
    this.router.navigate(['/phan-quyen/thiet-bi-thang-may']);
  }

  tangthangmay() {
    this.router.navigate(['/phan-quyen/thiet-lap-tang-thang-may']);
  }

  getCardCustomers(event) {
    const queryParams = queryString.stringify({cardCd: event.query});
    this.apiService.getCardCustomers(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: any) => {
      this.listCars = result.data.map(data => {
          return {
            ...data , fullNameAndCar: `${data.fullName}---${data.phoneNumber}---(${data.cardCd})`
          }
      });
    })
  }


  find() {
    this.apiService.getCardInfo(this.searchInfo.cardCode, this.searchInfo.phoneNumber, this.searchInfo.hardwareId).subscribe(
      (res: any) => {
        if (res) {
          this.cardinfo = res.data;
        }
      },
      error => {
      });
  }

  getBuidingsSearch() {
    this.apiService.getBuildCdByProjectCd(this.modelElevator.projectCd).subscribe(
      (res: any) => {
        if (res) {
          this.builds = res.data;
          this.buildingZones = [];
          this.floors = [];
          this.devices = [];
          this.modelElevator.buildZone = '';
          this.modelElevator.buildCd = '';
          this.modelElevator.floorNumber = null;
          this.modelElevator.hardwareId = null;
        }
      });
  }

  load() {
    if (this.detailcar.cardCd) {
      this.loading = true;
      this.apiService.getMasElevatorCards(this.detailcar.cardCd, 0, 100000).subscribe(
        (results: any) => {
          this.rowData = results.data;
          // this.gridApi.setRowData(this.items);
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
    }
  }

  getFloors(event) {
    this.apiService.GetBuildFloorByProjectCdBuildCd(event.target.value, this.modelElevator.projectCd, this.modelElevator.buildCd).subscribe((results: any) => {
      this.floors = results.data;
      this.devices = [];
      this.modelElevator.floorNumber = null;
      this.modelElevator.hardwareId = null;
    }, error => { });
  }

  getHardware() {
    this.apiService.getElevatorDevicePage('', null, null, this.modelElevator.projectCd, this.modelElevator.buildZone, this.modelElevator.buildCd, this.modelElevator.floorNumber).subscribe((results: any) => {
      this.devices = results.data;
      this.modelElevator.hardwareId = null;
    }, error => { });
  }

  load1() {
    this.loading = true;
    if (this.detailcar.cardCd) {
      this.apiService.getFoorInfoGo(this.detailcar.cardCd, this.modelElevator.projectCd, this.modelElevator.buildZone, this.modelElevator.buildCd, this.modelElevator.hardwareId, null, null).subscribe(
        (results: any) => {
          this.rowData1 = results.data;
          // this.autoSizeAll1()
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
    }
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  autoSizeAll1() {
    var allColumnIds = [];
    this.gridColumnApi1.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi1.autoSizeColumns(allColumnIds);
  }

  isDialog = false;
  AddNew() {
    this.cancelForm();
    this.modelcar = this.detailcar;
    this.cardinfo.fullName = this.detailcar.fullName;
    this.titleModal = 'Thêm gán quyền cho thẻ';
    this.cardinfo.id = 0;
    this.loadCardType();
    this.isDialog = true
    // jQuery('#createCardRole').modal('show');

  }

  SaveRoleCard(type) {
    this.cardinfo.cardId = this.modelcar.cardId;
    this.apiService.addRoleCard(this.cardinfo).subscribe(
      (results: any) => {
        if (results.status === 'error') {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Có lỗi!' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới thành công' });
          this.load();
        }
      }
      ,
      error => { });
    if (type === 1) {
      // jQuery('#createCardRole').modal('hide');
      this.isDialog = false
    } else {
      this.cancelForm();
    }
  }

  cancel() {
    this.key_car = '';
    this.detailcar = null;
    this.rowData = []
  }

  cancelTestdevices() {
    this.modelElevator = {
      cardCode: '',
      projectCd: '',
      buildZone: '',
      buildCd: '',
      floorNumber: null,
      hardwareId: null,
    }
    this.rowData1 = [];
  }

  loadElevatorCardRole() {
    this.apiService.getElevatorCardRole().subscribe(
      (res: any) => {
        if (res) {
          this.modelCR = res.data;
          this.cardinfo.cardRole = this.modelCR[0]['cardRole'];
        }
      });
  }

  loadCardType() {
    this.apiService.getCardTypeList().subscribe(
      (res: any) => {
        if (res) {
          this.modelCardType = res.data;
          this.cardinfo.cardType = this.modelCardType[0]['cardTypeId'];
        }
      });
  }

  loadGetProjects() {
    this.apiService.getProjects().subscribe(
      (res: any) => {
        if (res) {
          this.modelProject = res.data;
        }
      });
  }

  loadGetBuildings() {
    this.apiService.getBuildCdByProjectCd(this.cardinfo.projectCd).subscribe(
      (res: any) => {
        if (res) {
          this.modelBuilding = res.data;
          //  this.cardinfo.buildCd = res.data && res.data.length > 0 ? res.data[0].buildCd : '';
          this.loadGetFloors();
        }
      });
  }

  loadGetFloors() {
    this.modelFloor = [];
    this.apiService.getElevatorFloors(this.cardinfo.buildCd).subscribe(
      (res: any) => {
        if (res) {
          this.modelFloor = res.data;
          // this.cardinfo.floorNumber = res.data && res.data.length > 0 ? res.data[0].floorNumber : '';
        }
      });
  }

  cancelForm() {
    this.cardinfo = new CardInfo(0, 0, '', 0, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', null, null, '');
  }

  open(content) {
    this.cancelForm();
    // jQuery('#createCardRole').modal('show');
    this.isDialog = true;
    this.titleModal = 'Sửa gán quyền cho thẻ';
    this.modelcar = this.detailcar;
    this.cardinfo = content;
    this.loadGetBuildings();
    this.loadGetFloors();
  }

  onDeleteRoleCard(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa quyền của thẻ này không?')) {
      this.apiService.deleteRoleCard(id).subscribe(
        results => {
          this.load();
        },
        error => {
        });
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
  onFirstDataRendered1(params) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onGridReady1(params) {
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi;
  }
  projects = [];
  getProjectCd() {
    this.apiService.getProjects().subscribe((results: any) => {
      this.projects = results.data;
    })
  }

  buildingZones = [];
  getBuildingZones(e) {
    this.apiService.getBuildZoneByBuildCd(this.modelElevator.projectCd, this.modelElevator.buildCd).subscribe((results: any) => {
      this.buildingZones = results.data;
      this.floors = [];
      this.devices = [];
      this.modelElevator.buildZone = '';
      this.modelElevator.floorNumber = null;
      this.modelElevator.hardwareId = null;
    })
  }

  init() {
    this.frameworkComponents = {
      buttonAgGridComponent: ButtonAgGridComponent,
    };
    this.columnDefs = [
      {
        headerName: 'Mã thẻ',
        field: 'cardNumber',
        resizable: true,
      },
      {
        headerName: 'Quyền',
        field: 'roleName',
      },
      {
        headerName: 'Loại thẻ',
        field: 'cardTypeName',
        resizable: true,
      },
      {
        headerName: 'Dự án',
        field: 'projectName',
        resizable: true,
      },
      {
        headerName: 'Tòa nhà',
        field: 'buildName',
        resizable: true,
      },
      {
        headerName: 'Tầng',
        field: 'floorName',
      },
      {
        headerName: 'Thao tác',
        field: 'button',
        filter: '',
        width: 100,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: {
          buttons: [
            {
              onClick: this.onBtnClick1.bind(this),
              label: 'Sửa',
              icon: 'fa-edit',
              class: 'btn-primary',
            },
            {
              onClick: this.onBtnClick2.bind(this),
              label: 'Xóa',
              icon: 'fa-remove',
              class: 'btn-danger',
            },
          ]
        },
      },
    ]
    this.defaultColDef = {
      resizable: true,
      filter: 'agTextColumnFilter',
      sortable: true,
      cellClass: ['border-right']
    };

    this.getRowHeight = (params) => {
      return 40;
    };
  }
  gridColumnApi1
  gridApi1
  columnDefs1;
  defaultColDef1;
  getRowHeight1;
  rowData1 = [];
  init1() {
    this.columnDefs1 = [
      {
        headerName: 'ID',
        field: 'hardWareId',
        resizable: true,
      },
      {
        headerName: 'Tầng',
        field: 'floorName',
      },
      {
        headerName: 'Loại tầng',
        field: 'floorType',
        resizable: true,
      }
    ]
    this.defaultColDef1 = {
      resizable: true,
      filter: 'agTextColumnFilter',
      sortable: true,
      cellClass: ['border-right']
    };
    this.getRowHeight1 = (params) => {
      return 40;
    };
  }

  onBtnClick1(e) {
    this.open(e.rowData);
  }

  onBtnClick2(e) {
    this.onDeleteRoleCard(e.rowData.id)
  }

  selectedItem(event) {
    this.cardinfo.fullName = event.item.fullName;
  };

  detailcar
  selectedItem1(event) {
    this.detailcar = event;
    this.load();
  };

}

