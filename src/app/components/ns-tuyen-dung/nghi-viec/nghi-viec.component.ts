import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { Subject, takeUntil } from 'rxjs';
const MAX_SIZE = 100000000;
@Component({
  selector: 'app-nghi-viec',
  templateUrl: './nghi-viec.component.html',
  styleUrls: ['./nghi-viec.component.scss']
})
export class NghiViecComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS;
  selectedNode;
  listAgencyMap: TreeNode[];
  organizeList = []
  detailOrganizeMap = null;

  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  isHrDiagram: boolean = false
  query = {
    filter: '',
    reason_id: null,
    orgId: null,
    offSet: 0,
    pageSize: 20,
    status: -1,
    organizeIds: '',
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      filter: '',
      reason_id: null,
      orgId: null,
      offSet: 0,
      pageSize: 20,
      status: -1,
      organizeIds: this.query.organizeIds
    }
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getTerminateHiringePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        if (this.query.pageSize === MAX_SIZE) {
          this.query.pageSize = this.countRecord.totalRecord;
        }
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
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
      // buttons: [
      //   {
      //     onClick: this.tuyenDungLai.bind(this),
      //     label: 'Tuyển dụng lại',
      //     icon: 'fa fa-eye',
      //     class: 'btn-primary mr5',
      //     hide: CheckHideAction(MENUACTIONROLEAPI.GetTerminatePage.url, ACTIONS.TUYEN_DUNG_LAI)
      //   },
      // ]
    };
  }

  tuyenDungLai() {
    if(this.listDataSelect.length > 0){
      let userIds = String(this.listDataSelect);
      let empId = this.listDataSelect.toString();
      const params = queryString.stringify({empId: empId})
        this.confirmationService.confirm({
          message: 'Bạn có chắc chắn muốn tuyển dụng lại?',
          accept: () => {
            this.apiService.getCandidateAgain(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((results: any) => {
              if (results.status === 'success') {
                this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
                this.spinner.hide();
                this.load();
              } else {
                this.messageService.add({
                  severity: 'error', summary: 'Thông báo',
                  detail: results.message
                });
                this.spinner.hide();
              }
            }), error => {
              console.error('Error:', error);
              this.spinner.hide();
            };
          }
        });  
      }  
  }

  initGrid() {
    this.columnDefs = [
      {
        field: '',
        checkboxSelection: true,
        showDisabledCheckboxes: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      // {
      //   headerName: 'Thao tác',
      //   filter: '',
      //   width: 100,
      //   pinned: 'right',
      //   cellRenderer: 'buttonAgGridComponent',
      //   cellClass: ['border-right', 'no-auto'],
      //   cellRendererParams: (params: any) => this.showButtons(params),
      //   checkboxSelection: false,
      //   field: 'checkbox'
      // }
    ]

  }
  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Tuyển dụng'},
      { label: 'Tuyển dụng lại' },
    ];
    this.load();
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
    this.apiService.getAgencyOrganizeMap()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null || localStorage.getItem("organize") === 'undefined') {
          this.selectedNode = this.listAgencyMap[0];
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          // this.query.organizeId = this.selectedNode.orgId;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          // this.query.organizeId = this.selectedNode?.orgId;
          this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parentId)
          this.selected(this.listAgencyMap, this.query.orgId);
          if (type) {
            this.isHrDiagram = true;
          }
          this.load();
        }
      }
    })
  }
  listDataSelect = []
  rowSelected(data) {
    this.listDataSelect = []
      data.forEach(element => {
          this.listDataSelect.push(element.CustId)
      });

    }

}
