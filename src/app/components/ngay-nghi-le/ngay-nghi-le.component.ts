import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-ngay-nghi-le',
  templateUrl: './ngay-nghi-le.component.html',
  styleUrls: ['./ngay-nghi-le.component.scss']
})
export class NgayNghiLeComponent implements OnInit {
  excelStyles = [
    {
      id: 'stringType',
      dataType: 'string'
    },
    {
      id: 'dateType',
      dataType: 'dateTime'
    },
    {
      id: 'numberType',
      dataType: 'number'
    }
  ];
  pagingComponent = {
    total: 0
  };
  projects = []
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
  listsData = null;
  selectedNode
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  // for the move organ
  departmentFiltes = [];
  years = [
    {label: '2020', value: 2020},
    {label: '2021', value: 2021},
    {label: '2022', value: 2022},
    {label: '2023', value: 2023},
  ]
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      tooltipComponentParams: { color: '#ececec' },
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 50;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };


  }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
    OrganizeId: null,
    DepartmentId: null,
    HoliType: null,
    HoliWorkType: null,
    Year: 2022,
  }
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  detailOrganizeMap = null;
  isHrDiagram: boolean = false
  employeeStatus= []
  onmouseenter(event) {
    console.log(event)
  }
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      OrganizeId: this.query.OrganizeId,
      DepartmentId: null,
      HoliType: null,
      HoliWorkType: null,
      Year: 2022,
    }
    this.load();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAgencyOrganizeMap(type = false) {
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          this.query.OrganizeId = this.selectedNode.orgId;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          this.query.OrganizeId = this.selectedNode?.orgId;
          this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parentId)
          this.selected(this.listAgencyMap, this.query.OrganizeId);
          if (type) {
            this.isHrDiagram = true;
          }
          this.load();
        }
      }
    })
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

  selected(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }

  themmoingaynghi() {
    const params = {
      id: 0
    }
    this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le/them-moi-ngay-nghi'], { queryParams: params });
  }


  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.holidayPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
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
          onClick: this.EditEmployee.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.xoanhanvien.bind(this),
          label: 'Xóa nhân viên này',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'Stt',
        filter: '',
        maxWidth: 90,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 90,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]

    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.AgencyGenerals);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.AgencyGenerals.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  xoanhanvien(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa nhân viên?',
      accept: () => {
        this.apiService.deleteEmployee(event.rowData.empId).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  EditEmployee(event) {
    const params = {
      id: event.rowData.id
    }
    this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le/chi-tiet-ngay-nghi'], { queryParams: params });
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  ngOnInit() {
    this.getObjectList();
    this.getObjectListWorkType();
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách ngày nghỉ' },
    ];
    this.getAgencyOrganizeMap();
    this.getOrgan();
  }
  holiTypes = []
  getObjectList() {
    const queryParams = queryString.stringify({ objKey: 'holi_type' });
    this.apiService.getCustObjectListNew(false,queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.holiTypes = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
        this.holiTypes = [{ label: 'Tất cả', value: null }, ...this.holiTypes]
      }
    })
  }
  
  holiWorkType = []
  getObjectListWorkType() {
    const queryParams = queryString.stringify({ objKey: 'holi_work_type' });
    this.apiService.getCustObjectListNew(false,queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.holiWorkType = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
        this.holiWorkType = [{ label: 'Tất cả', value: null }, ...this.holiWorkType]
      }
    })
  }
 
  organizeList = []
  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    localStorage.setItem('organize', JSON.stringify(event.node));
    this.query.OrganizeId = this.detailOrganizeMap?.orgId;
    this.isHrDiagram = false;
    this.load()
  }

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
    this.getAgencyOrganizeMap(true);
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }

  exportGrid() {
    this.gridApi.exportDataAsExcel();
  }

  getContextMenuItems(params) {
    var result = [
      'copy',
      'paste',
      'separator',
    ];
    return result;
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  organs = []
  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
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

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.OrganizeId });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  handleChangeOrganize() {
    this.getOrganizeTree();
  }
 
  selectBoPhan() {
    this.getOrganizeTree();
    this.find();
  }

  listDataSelect = [];
  rowSelected(data) {
    this.listDataSelect = data
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + e.clientHeight + 35;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

}
