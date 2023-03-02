import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import * as queryString from 'querystring';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-cai-dat-lich-hop',
  templateUrl: './cai-dat-lich-hop.component.html',
  styleUrls: ['./cai-dat-lich-hop.component.scss']
})
export class CaiDatLichHopComponent implements OnInit {
  public modules: Module[] = AllModules;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

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
  organs = [];
  selectedNode;
  listAgencyMap: TreeNode[];
  isHrDiagram: boolean = false;
  detailOrganizeMap = null;
  model = {
      filter: '',
      gridWidth: '',
      offSet: 0,
      pageSize: 20,
  }
  statusRoom = [
    {
      label: 'Đã họp',
      value: "Đã họp",
    },
    {
      label: 'Đang họp',
      value: "Đang họp"
    },
    {
      label: 'Sắp họp',
      value: "Sắp họp"
    },
    {
      label: 'Đã lên lịch',
      value: "Đã lên lịch"
    },
  ]
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
    private organizeInfoService: OrganizeInfoService,
    public dialogService: DialogService,
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
  
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  items = [];
  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Hoạt động' },
      { label: 'Lịch họp' },
    ];
    this.getFilter();
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        const totalHeight = a.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
        this.loadjs = 0;
      }
    }
  }

  initFilter(): void {
    this.model = {
      filter: '',
      gridWidth: '',
      offSet: 0,
      pageSize: 20,
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
    let params: any = { ... this.model };
    const queryParams = queryString.stringify(params);
    this.apiService.getMeetingPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
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
        this.FnEvent();
      },
      error => {
        this.spinner.hide();
       });
  }
  
  showButtons(event: any) {
    return {
      // đã họp và đang họp
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Sửa',
          icon: 'fa fa-pencil-square-o',
          class: 'btn-primary mr5',
          hide: this.CheckHideSua(event)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Hủy',
          icon: 'pi pi-times',
          class: 'btn-danger mr5',
          hide: this.CheckHideDele(event)
        },
      ]
    };
  }

  CheckHideSua(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetMeetingPage.url, ACTIONS.VIEW);
    if(checkValue) {
      return true;
    }else {
      if(event.data.is_edit !== 1) {
        return true;
      }else {
        return false;
      }
    }
  }

  CheckHideDele(event) {
    if(CheckHideAction(MENUACTIONROLEAPI.GetMeetingPage.url, ACTIONS.HUY_LICH_HOP)) {
      return true;
    }else {
      if(event.data.is_edit !== 1) {
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
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.gridflexs.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto', 'text-center', 'cell-options'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

  }

  floors = []
  getFloor() {
    this.apiService.getFloorNo()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.floors = (results.data).map(d => {
          return { 
            label: 'Tầng' + ' ' + d.name, 
            value: d.value 
          }
        });
      }
    })
  }

  isReasonDelete = false;
  queryDeleteLichHop = {
    meet_ud: '',
    reason_cancel: ''
  }
  delRow(e): void {
    this.isReasonDelete = true;
    this.queryDeleteLichHop.meet_ud = e.rowData.meet_ud
  }

  deleteLichHop() {
    if(!this.queryDeleteLichHop.reason_cancel){
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Vui lòng điền lý do hủy` });
      return
    }
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn hủy lịch họp không?',
      accept: () => {
        this.apiService.delMeetingInfo(queryString.stringify(this.queryDeleteLichHop))
        .pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => {
            if (response.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Hủy lịch họp thành công` });
              this.load();
              this.FnEvent();
              this.isReasonDelete = false;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Hủy lịch họp thất bại` });
            }
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Hủy lịch họp thất bại` });
            this.isReasonDelete = false;
          });
      }
    });
  }

  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.organs = results.data.map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        this.organs = [...this.organs];
      }
    })
  }

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
    this.getAgencyOrganizeMap(true);
  }

  selected(datas = [], orgId = '') {
    datas.forEach(d => {
      if (d.orgId == orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }

  expanded(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
      }
      d.children.forEach((elm: { children: { expanded: boolean; }[]; expanded: boolean; }) => {
        elm.children.forEach((e: { expanded: boolean; }) =>{
          if (e.expanded === true) {
            elm.expanded = true
          }
        })
      });      
    })
    return datas
  }

  getAgencyOrganizeMap(type = false) {
    // this.apiService.getAgencyOrganizeMap().subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listAgencyMap = [...results.data.root];
    //     if (localStorage.getItem("organize") === null || localStorage.getItem("organize") === 'undefined') {
    //       this.selectedNode = this.listAgencyMap[0];
    //       localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
    //       // this.query.organizeId = this.selectedNode.orgId;
    //       this.load();
    //     } else {
    //       this.selectedNode = JSON.parse(localStorage.getItem("organize"));
    //       // this.query.organizeId = this.selectedNode?.orgId;
    //       this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parentId)
    //       this.selected(this.listAgencyMap, this.model.organization);
    //       if (type) {
    //         this.isHrDiagram = true;
    //       }
    //       this.load();
    //     }
    //   }
    // })
  }

  manageBuilding(): void {
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/danh-sach-phong-hop']);
  }

  editRow({rowData}): void {
    const params = {
      meet_ud: rowData.meet_ud
    }
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/chi-tiet-lich-hop'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
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
    this.FnEvent();
  }
  handlerError(error): void {
    console.log(error);
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
  }

  find(): void {
    this.load();
    this.FnEvent();
  }

  cancel(): void {
    this.initFilter();
    this.load();
    this.FnEvent();
  }

  changePageSize(): void {
    this.load();
    this.FnEvent();
  }

  handleAdd(): void {
    const params = {
      meet_ud: ''
    }
    this.router.navigate(['/cai-dat/cai-dat-lich-hop/them-moi-lich-hop'], { queryParams: params });
  }

  toManagerRoom(): void {
    this.router.navigate(['/hoat-dong/lich-hop/danh-sach-phong-hop']);
  }

  importSuccess(): void {
    this.load();
    this.showImportExcel = false;
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v2/meeting/GetMeetingFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.model = { ...this.model, ...params};
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

   filterLoad(event) {
    this.model = { ...this.model, ...event.data };
    this.load();
    this.FnEvent();
  }

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.model = { ...this.model, ...params};
      this.load();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.handleAdd()
        });
      }
    }, 300);
  }
}

