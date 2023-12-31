import { ChangeDetectorRef, Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ElevatorFloor } from 'src/app/models/elevatorfloor.model';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-thiet-lap-tang-thang-may',
  templateUrl: './thiet-lap-tang-thang-may.component.html',
  styleUrls: ['./thiet-lap-tang-thang-may.component.scss']
})
export class ThietLapTangThangMayComponent implements OnInit {

  constructor(private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router) {
      this.titleModal = 'Thêm thiết Lập';
     }
    items = [];
    totalRecord = 0;
    countRecord: any = {
      totalRecord: 0,
      currentRecordStart: 0,
      currentRecordEnd: 0
    };
    projects = [];
    builds = [];
    buidings = [];
    floors = [];
    floorsTypes = [];
    buildzones = [];
    buildingZones = [];
    floorsCreate = [];
    titleModal: string;
    elevatorfloorModel: ElevatorFloor = ElevatorFloor.createDefault();
  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Phân quyền' },
      { label: 'Phân quyền thang máy', routerLink: '/phan-quyen/phan-quyen-thang-may' },
      { label: 'Thiết lập tầng thang máy' },
    ];
    this.load();
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


  columnDefs = [];
  listsData = [];
  cols = [];
  model: any = {
    filter: '',
    projectCd: '',
    buildZone: '',
    buildCd: '',
    pageSize: 15,
    offset: 0
  };
  load() {
    this.columnDefs = []
    this.spinner.show();
    this.apiService.GetElevatorFloorPage(this.model.filter,
      this.model.offset,this.model.pageSize,
      this.model.projectCd,
      this.model.buildCd,
      this.model.buildZone).subscribe(
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
          onClick: this.editElevatorfloor.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
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
        headerName: 'Mã tòa',
        cellClass: ['border-right'],
        field: 'buildCd',
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
        headerName: 'Loại tầng',
        cellClass: ['border-right'],
        field: 'floorType',
      },
      {
        headerName: 'Số tầng',
        cellClass: ['border-right'],
        field: 'floorNumber',
      },
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
      }
    ]
  }


  findproject(projectCd, type) {
    this.builds = [];
    this.buildzones = [];
    this.apiService.getBuildByProjectCd(projectCd).subscribe((results: any) => {
      this.builds = results.data;
    },
    error => { });
  }

  findbuild(buildCd, type){
    this.buildzones = [];
    this.apiService.getBuildZoneByBuildCd('', buildCd).subscribe((results: any) => {
      this.buildzones = results.data;
    },error => { });
  }

   //api create
  getBuilding(projectCd) {
    this.apiService.getBuildByProjectCd(projectCd).subscribe((results: any) => {
      this.buidings = results.data;
    },
    error => { });
  }

  //api create
  getBuildingzonesAndFloors(buildCd){
    this.buildingZones = [];
    this.apiService.getBuildZoneByBuildCd('', buildCd).subscribe((results: any) => {
      this.buildingZones = results.data;
    },error => { });

    this.apiService.GetBuildFloorByProjectCdBuildCd('', this.elevatorfloorModel.projectCd, buildCd).subscribe((results: any) => {
      this.floorsCreate = results.data;
    },error => { });
    this.apiService.getFloorTypeByBuildCd(buildCd).subscribe((results: any) => {
      this.floorsTypes = results.data;
    },error => { });
  }
  
  addThietLapTang() {
    this.elevatorfloorModel = ElevatorFloor.createDefault()
    this.isDialog = true;
  }
  isDialog = false;
  onSave() {
    const floors = this.floorsCreate.filter(res => res.floorNumber === this.elevatorfloorModel.floorNumber);
    const params ={
        id: this.elevatorfloorModel.id,
        projectCd: this.elevatorfloorModel.projectCd,
        buildCd: this.elevatorfloorModel.buildCd,
        buildZone: this.elevatorfloorModel.buildZone,
        floorNumber: floors.length > 0 ? parseInt(floors[0].floorNumber) : 0,
        floorName: floors.length > 0 ? floors[0].floorName : '',
        floorType: this.elevatorfloorModel.floorType,
        sysDate: this.elevatorfloorModel.sysDate
    }
    this.apiService.setMasElevatorFloor(params).subscribe((result: any) => {
      if(result.status === 'success') {
      this.isDialog =false;
        this.load();
      }
    })
  }

  editElevatorfloor(event, idx) {
    const item = event.rowData
    this.titleModal = "Sửa thiết lập"
    this.elevatorfloorModel.projectCd = item.projectCd;
    this.getBuilding(item.projectCd);
    this.getBuildingzonesAndFloors(item.buildCd);
    this.elevatorfloorModel = item;
    this.isDialog = true
  }

  changebuildName(event) {
    this.getBuildingzonesAndFloors(event.target.value);
  }

  changeBuilding(event) {
    this.getBuilding(event.target.value);
  }

  first = 0
  paginate(event: any) {
    this.model.offset = event.first;
    this.first = event.first;
    this.model.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  cancel() {
    this.load();
  }

}
