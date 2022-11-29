import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-cs-an-ca',
  templateUrl: './cs-an-ca.component.html',
  styleUrls: ['./cs-an-ca.component.scss']
})
export class CsAnCaComponent implements OnInit, AfterViewChecked {

  dataAnCa: any;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  rowDataSelected:any = []
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
  listStatus = [];
  listOrgRoots = [];
  displayFrom = false;
  pagingComponent = {
    total: 0
  }
  detailInfo = null
  listViews = [];
  isDetail = false;

  titleForm = {
    label: 'Thêm mới tài khoản',
    value: 'Add'
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
  selectedValue = null;
  query: any = {
    orgId: null,
    // request_status: '',
    filter: '',
    offSet: 0,
    pageSize: 15,
    fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    organizeIds: '',
    position: '',
    companyIds: []
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  companies = []

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.selectedValue = null;
    this.query = {
      orgId: null,
      // request_status: '',
      filter: '',
      offSet: 0,
      pageSize: 15,
      fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
      todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
      organizeIds: this.query.organizeIds,
      companyIds: this.query.companyIds
    }
    if(this.companies.length > 0) {
      this.query.companyIds = this.companies[0].value;
    }
    this.load();
  }

  listsData = [];

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = {... this.query};
    let companyIds = this.query.companyIds.toString();
    params.companyIds = companyIds;
    delete params.fromdate
    delete params.todate
    params.FromDate = moment(new Date(this.query.fromdate)).format('YYYY-MM-DD')
    params.ToDate = moment(new Date(this.query.todate)).format('YYYY-MM-DD');
    params.orgId = this.selectedValue ? this.selectedValue.orgId : null

    const queryParams = queryString.stringify(params);
    this.apiService.getEatingPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.result.dataList.data;
        this.gridKey= results.data.result.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols =  results.data.result.gridflexs;
          // this.colsDetail =  results.data.result.gridflexdetails ?  results.data.result.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.result.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.result.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.result.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.result.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.result.dataList.recordsTotal;
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
          onClick: this.listDetail.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEatingPage.url, ACTIONS.VIEW)
        },
        // {
        //   onClick: this.xoaTienLuong.bind(this),
        //   label: 'Xóa',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },
        // {
        //   onClick: this.CloseAccount.bind(this),
        //   label: 'Đóng tài khoản',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: '',
        width: 60,
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        field: 'checkbox2',
        headerCheckboxSelection: false,
        suppressSizeToFit: true,
        suppressRowClickSelection: true,
        showDisabledCheckboxes: true,
        checkboxSelection: true,
        rowSelection: 'single'
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
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

  xoaTienLuong(event) {
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn thực hiện mở tài khoản?',
    //   accept: () => {
    //     const queryParams = queryString.stringify({ companyId: event.rowData.companyId });
    //     this.apiService.delCompanyInfo(queryParams).subscribe(results => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
    //         this.load();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  XemChiTiet(event) {
    const params = {
      custId: event.rowData.custId
    }
    this.router.navigate(['/chinh-sach/an-ca/chi-tiet-an-ca'], { queryParams: params });
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

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    let b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        const totalHeight = a.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.loadjs = 0;
      }
    }
  }

  ngOnInit() {
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = results;
          this.rowDataSelected = []
          this.getCompany();
          this.getOrganizeTree();
        }
    });
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách ăn ca' },
    ];
    this.getOrgRoots();
  }

  getOrgRoots() {
    this.apiService.getOrgRoots().subscribe(results => {
      if (results.status === 'success') {
        this.listOrgRoots = results.data.map(d => {
          return {
            label: d.org_name + '-' + d.org_cd,
            value: `${d.orgId}`
          }
        });

        this.listOrgRoots = [{ label: 'Tất cả', value: null }, ...this.listOrgRoots];
      }
    })
  }

  departmentFiltes = []
  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  onNodeSelect (event) {

  }
  sizeToFit() {
    if (this.gridApi) {
      let allColumnIds: any = [];
      this.gridColumnApi.getAllColumns()
        .forEach((column: any) => {
          if (column.colDef.cellClass.indexOf('no-auto') < 0) {
            allColumnIds.push(column)
          } else {
            column.colDef.suppressSizeToFit = true;
            allColumnIds.push(column)
          }
        });
      this.gridApi.sizeColumnsToFit(allColumnIds);
    }
  }

  autoSizeAll() {
    if (this.gridColumnApi) {
      if (this.gridColumnApi.columnController.bodyWidth < this.gridColumnApi.columnController.scrollWidth) {
        this.sizeToFit();
      } else {
        let allColumnIds: any = [];
        this.gridColumnApi.getAllColumns()
          .forEach((column: any) => {
            if (column.colDef.cellClass.indexOf('no-auto') < 0) {
              allColumnIds.push(column)
            }
          });
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      }
    }
  }

  // list ăn ca
  listDetail(event = null) {
    
    const params = {
      cusId: ''
    }
    if(event){
      params.cusId = event.rowData.custId
    }
    this.router.navigate(['/chinh-sach/an-ca/chi-tiet-danh-sach-an-ca'], { queryParams: params });
  }

  rowSelected(event) {
    this.rowDataSelected = event;
  }

  handAddNew () {
    this.detailInfo = []
    this.listViews = []
    const params = { cusId: null }
    this.isDetail = true;
    this.apiService.getEatingForCreateInfo(queryString.stringify(params)).subscribe( results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = [...listViews];
        this.detailInfo = results.data;
      }
    }) 
  }
  
  positions = [];
  getOrgPositions() {
    this.positions = [];
    const queryParams = queryString.stringify({ orgId: this.selectedValue.data });
    this.apiService.getOrgPositions(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.positions = results.data.map(d => {
          return { label: d.positionName, value: d.positionCd }
        });
        this.positions = [{ label: 'Tất cả', value: null }, ...this.positions]
      }
    })
  }


  getCompany() {
    const query = { organizeIds: this.query.organizeIds}
    this.apiService.getUserCompanies(queryString.stringify(query)).subscribe(
      (results: any) => {
        if(results.status === "success"){
          this.companies = results.data
            .map(d => {
              return {
                label: d.name,
                value: d.value
              };
            });
            if(this.companies.length > 0) {
              this.query.companyIds = this.companies[0].value
            }
            this.load();
        }
      }),
      error => { };
  }

  setChitiet(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEatingInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.isDetail = false;
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  exportData() {
    this.spinner.show();
    let params: any = {... this.query};
    let companyIds = this.query.companyIds.toString();
    params.companyIds = companyIds;
    delete params.fromdate
    delete params.todate
    params.FromDate = moment(new Date(this.query.fromdate)).format('YYYY-MM-DD')
    params.ToDate = moment(new Date(this.query.todate)).format('YYYY-MM-DD');
    params.orgId = this.selectedValue ? this.selectedValue.orgId : null

    const queryParams = queryString.stringify(params);
      this.apiService.gxportEatingPage(queryParams).subscribe(results => {
        if (results.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, `Danh sách ăn ca` +".xlsx");
          this.spinner.hide();
        }
      })
  }

}


