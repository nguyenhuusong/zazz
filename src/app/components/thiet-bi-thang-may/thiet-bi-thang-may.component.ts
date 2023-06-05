
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';

import { fromEvent, Subject, takeUntil } from 'rxjs';
import queryString from 'query-string';
declare var jQuery: any;

@Component({
  selector: 'app-thiet-bi-thang-may',
  templateUrl: './thiet-bi-thang-may.component.html',
  styleUrls: ['./thiet-bi-thang-may.component.scss']
})
export class ThietBiThangMayComponent implements OnInit {

  constructor(private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    
    private router: Router) {
      this.titleModal = 'Thêm thiết Lập';
     }
    items = [];
    MENUACTIONROLEAPI = MENUACTIONROLEAPI;
    ACTIONS = ACTIONS
  
    listShafts = [];
    model: any = {
      filter: '',
      projectCd: '',
      buildZone: '',
      buildCd: '',
      floorNumber: null,
      pageSize: 20,
      offset: 0,
      organizeIds: '',
    };
    modelElevator = {
      id: 0,
      hardwareId: '',
      floorName: '',
      buildCd: '',
      floorNumber: null,
      elevatorBank: 0,
      elevatorShaftName: '',
      elevatorShaftNumber: 0,
      projectCd: '',
      buildZone: '',
      isActived: false,
      sysDate: new Date(),
    };
    totalRecord = 0;
    countRecord: any = {
      totalRecord: 0,
      currentRecordStart: 0,
      currentRecordEnd: 0
    };
    searchBuildzones = []
    projects = [];
    builds = [];
    buidings = [];
    floors = [];
    floorsTypes = [];
    modelBuilding = [];
    buildzones = [];
    buildingZones = [];
    floorsCreate = [];
    titleModal: string;
    searchFloors = []
  ngOnInit() {
    this.load();
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Phân quyền' },
      { label: 'Phân quyền thang máy', routerLink: '/phan-quyen/phan-quyen-thang-may' },
      { label: 'Thiết bị thang máy' },
    ];
    this.getProjectCd();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getBuidingsSearch() {
    const queryParams = queryString.stringify({ projectCd: this.model.projectCd });
    this.apiService.getBuildCdByProjectCd(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (res: any) => {
        if (res) {
          this.builds = res.data;
        }
      });
  }
  findBuildZone() {
  this.searchBuildzones = [];
    this.apiService.getBuildZoneByBuildCd(this.model.projectCd, this.model.buildCd)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      this.searchBuildzones = results.data;
    })
  }

  columnDefs = [];
  listsData = [];
  cols = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const elevatorQuery = {
      filter: this.model.filter,
      offSet: this.model.offset,
      pageSize: this.model.pageSize,
      projectCd: this.model.projectCd,
      buildCd: this.model.buildCd,
      buildZone: this.model.buildZone,
      floorNumber: this.model.floorNumber
    }

    this.apiService.getElevatorDevicePage(queryString.stringify(elevatorQuery))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
      (results: any) => {
        this.listsData = results.data;
        if (this.model.offset === 0) {
          this.cols = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results.recordsTotal;
        this.countRecord.totalRecord = results.recordsTotal;
        this.countRecord.currentRecordStart = this.model.offset + 1;
        if ((results.recordsTotal - this.model.offset) > this.model.pageSize) {
          this.countRecord.currentRecordEnd = this.model.offset + Number(this.model.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.recordsTotal;
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
          onClick: this.editElevatordevice.bind(this),
          label: 'Xem',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetElevatorDevicePage.url, ACTIONS.VIEW)

        },
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'Mã',
        cellClass: ['border-right'],
        field: 'id',
      },
      {
        headerName: 'Mã dự án',
        cellClass: ['border-right'],
        field: 'projectCd',
      },
      {
        headerName: 'Tên dự án',
        cellClass: ['border-right'],
        field: 'projectName',
      },
      {
        headerName: 'Mã thiết bị',
        cellClass: ['border-right'],
        field: 'hardwareId',
      },
      {
        headerName: 'Khu vực',
        cellClass: ['border-right'],
        field: 'buildZone',
      },
      {
        headerName: 'Tên tầng',
        cellClass: ['border-right'],
        field: 'floorName',
      },
      {
        headerName: 'Thứ tự',
        cellClass: ['border-right'],
        field: 'floorNumber',
      },
      {
        headerName: 'Trạng thái',
        cellClass: ['border-right'],
        field: 'isActived',
      },
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="btn-thiet-bi-thang-may"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
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

  getProjectCd(){
    this.apiService.getProjects()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      this.projects = results.data;
    })
  }

  getBuildingZones() {
    this.buildingZones = [];
    this.apiService.getBuildZoneByBuildCd(this.modelElevator.projectCd, this.modelElevator.buildCd)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      this.buildingZones = results.data;
    },
    error => { });
   
  }

  loadGetBuildings() {
    const queryParams = queryString.stringify({ projectCd: this.modelElevator.projectCd });
    this.apiService.getBuildCdByProjectCd(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
     (res: any) => {
       if (res) {
         this.modelBuilding = res.data;
       }
     });
  }

  loadGetFloors() {
    this.floorsCreate = [];
    const queryParams = queryString.stringify({ buildCd: this.modelElevator.buildCd });
    this.apiService.getElevatorFloors(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
    (res: any) => {
      if (res) {
        this.floorsCreate = res.data;
      }
    });
  }

  findFloors() {
    this.searchFloors = [];
    const queryParams = queryString.stringify({ buildCd: this.model.buildCd });
    this.apiService.getElevatorFloors(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
    (res: any) => {
      if (res) {
        this.searchFloors = res.data;
      }
    });
  }
  
  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    const e: any = document.querySelector(".paginator");
    
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + e.clientHeight + 73;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  addThietBi() {
    this.cancelModel();
    this.isDialog = true;
  }
  first = 0
  paginate(event: any) {
    this.model.offset = event.first;
    this.first = event.first;
    this.model.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }


  find(){
    this.load();
  }

  cancel() {
    this.load();
    this.model = {
      filter: '',
      projectCd: '',
      buildZone: '',
      buildCd: ''
    };
  }
  isDialog = false;
  onSave() {
    const floors = this.floorsCreate.filter(res => res.floorNumber == this.modelElevator.floorNumber);
    // const elevatorShafs = this.listShafts.filter(res => res.elevatorShaftName == this.modelElevator.elevatorShaftName);
    const params ={
        id: this.modelElevator.id,
        projectCd: this.modelElevator.projectCd,
        hardwareId: this.modelElevator.hardwareId,
        buildZone: this.modelElevator.buildZone,
        floorNumber: floors.length > 0 ? parseInt(floors[0].floorNumber) : 0,
        floorName: floors.length > 0 ? floors[0].floorName : '',
        elevatorShaftNumber: null,
        elevatorShaftName: null,
        sysDate: this.modelElevator.sysDate,
        isActived: this.modelElevator.isActived,
        elevatorBank: null,
        buildCd: this.modelElevator.buildCd
    }
    this.apiService.setMasElevatorDevice(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: any) => {
      if(result.status === 'success') {
        this.isDialog = false;
        this.load();
      }
    })
  }

  editElevatordevice(event, idx) {
    const item = event.rowData;
    this.cancelModel();
    this.modelElevator.projectCd = item.projectCd;
    this.modelElevator.buildCd = item.buildCd;
    this.loadGetBuildings();
    this.getBuildingZones();
    this.loadGetFloors();
    this.modelElevator.id = item.id;
    this.modelElevator.floorNumber = item.floorNumber;
    this.modelElevator.elevatorBank = item.elevatorBank;
    this.modelElevator.floorName = item.floorName;
    this.modelElevator.elevatorShaftNumber = item.elevatorShaftNumber;
    this.modelElevator.elevatorShaftName = item.elevatorShaftName;
    this.modelElevator.buildZone = item.buildZone;
    this.modelElevator.isActived = item.isActived;
    this.modelElevator.sysDate = item.sysDate;
    this.modelElevator.hardwareId = item.hardwareId;
    this.isDialog = true; 
  }

  cancelModel(){
    this.modelElevator = {
      id: 0,
      hardwareId: '',
      floorName: '',
      buildCd: '',
      floorNumber: null,
      elevatorBank: 0,
      elevatorShaftName: '',
      elevatorShaftNumber: 0,
      projectCd: '',
      buildZone: '',
      isActived: false,
      sysDate: new Date(),
    };

    this.modelBuilding = [];
    this.buildingZones = [];
    this.floorsCreate = [];
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById('btn-thiet-bi-thang-may');
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addThietBi()
        });
      }
    }, 300);
  }

}


