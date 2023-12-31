import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { HttpParams } from '@angular/common/http';
import { WebsocketService2 } from 'src/app/services/websocket.service';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
@Component({
  selector: 'app-xu-ly-hop-dong',
  templateUrl: './xu-ly-hop-dong.component.html',
  styleUrls: ['./xu-ly-hop-dong.component.scss']
})
export class XuLyHopDongComponent implements OnInit {

  dataContractTypes: any;
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private webSocketService: WebsocketService2,
    private router: Router) {
    this.webSocketService.connect(environment.socketServer);
    this.webSocketService.emit("action", 'PRINT_LIST_PRINTERS')
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
  pagingComponent = {
    total: 0
  }

  titleForm = {
    label: 'Thêm mới tài khoản',
    value: 'Add'
  }

  modelDuyetHopDong = {
    contractId: null,
    status: 1,
    comment: '',
    type: 'duyet_ho_so'
  }

  statusContracts = [];
  typeContracts = []
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs;
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
  query: any = {
    filter: '',
    offSet: 0,
    pageSize: 15,
    organizeId: null,
    orgId: null,
    contract_st: null,
    contractTypeId: null,
    fromDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).add(-1, 'months').format("YYYY-MM-DD")),
    toDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format("YYYY-MM-DD")),
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  // import 
  showImportExcel = false
  file = null;
  loading = false;
  itemsToolOfGrid: any[] = [];

  isShowbtnPheDuyet = true;
  paramsPheDuyet: any = []

  isPrinted: boolean = false;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
      organizeId: null,
      orgId: null,
      contract_st: null,
      contractTypeId: null,
      fromDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).add(-1, 'months').format("YYYY-MM-DD")),
      toDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format("YYYY-MM-DD")),
    }
    this.load();
  }

  DowloadPlugin() {
    this.downloadButtonClicked('https://firebasestorage.googleapis.com/v0/b/sunshine-app-production.appspot.com/o/s_hrm%2Fhrm-plugin%2FUniPlugin.zip?alt=media&token=838880e5-f2e2-4044-8d5f-21e57a5f3335')
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
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
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 26;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  listsData = [];
  listOrgRoots = [];
  getOrgRoots() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listOrgRoots = results.data.map(d => {
          return {
            label: d.organizationName + '-' + d.organizationCd,
            value: `${d.organizeId}`
          }
        });

        this.listOrgRoots = [{ label: 'Tất cả', value: null }, ...this.listOrgRoots];
      }
    })
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }
  
  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = { ... this.query };
    delete params.fromDate
    delete params.toDate
    // params.fromDate = moment(new Date(this.query.fromDate)).format('YYYY-MM-DD')
    // params.toDate = moment(new Date(this.query.toDate)).format('YYYY-MM-DD')
    params.fromDate = typeof this.query.fromDate === 'object' ? moment(new Date(this.query.fromDate)).format('YYYY-MM-DD') : this.query.fromDate;
    params.toDate = typeof this.query.toDate === 'object' ? moment(new Date(this.query.toDate)).format('YYYY-MM-DD') : this.query.toDate;
    const queryParams = queryString.stringify(params);
    this.apiService.getContractPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
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
      this.setQueryLocalStorage();
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.updateStatus.bind(this),
          label: 'Cập nhật trạng thái hợp đồng',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: event.data.contract_value === 3
        },
        {
          onClick: this.XoaQuaTrinhHopDong.bind(this),
          label: 'Xóa ',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: event.data.contract_value > 0
        },
      ]
    };
  }

  showButtons1(event: any) {
    return {
      buttons: [
        {
          onClick: this.deleteRowPrint.bind(this),
          label: 'Xóa',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
      ]
    };
  }

  deleteRowPrint(event) {

  }
  // GET /api/v2/contract/GetContractInfo
  XemChiTiet(event) {
    const modelContractInfo = {
      contractId: event.rowData.contractId,
      contractTypeId: event.rowData.contractTypeId,
      empId: event.rowData.empId,
      organizeId: event.rowData.organizeId
    }
    this.router.navigate(['/nhan-su/xu-ly-hop-dong/chi-tiet-xu-ly-hop-dong'], { queryParams: modelContractInfo });

  }

  updateStatus(event) {
    this.modelDuyetHopDong.type = event.rowData.contract_value === 0 ? 'duyet_ho_so' : 'huy_duyet';
    this.modelDuyetHopDong.contractId = event.rowData.contractId;
    this.modelDuyetHopDong.status = 1;
    this.modelDuyetHopDong.comment = '';
    this.displayApproveContract = true;
  }

  XoaQuaTrinhHopDong(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa hợp đồng?',
      accept: () => {
        const queryParams = queryString.stringify({ contractId: event.rowData.contractId });
        this.apiService.delContractInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa hợp đồng thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  columnDefsPrint = []
  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox'
      }
    ]

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
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  listPrints = []
  ngOnInit() {
    this.webSocketService.myWebSocket
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        repon => {
          repon = JSON.parse(repon)
          if (repon && repon.data && repon.data.length > 0) {
            this.listPrints = repon.data.map(d => {
              return {
                label: d,
                value: d
              }
            })
          }
        },
        err => {
          console.log(err)
        },
      )
    this.getOrgRoots();
    this.getCustObjectListNew();
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Nhân sự' },
      { label: 'Xử lý hợp đồng' }
    ];
    this.getQueryLocalSotrage();
    this.load();


    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-file-excel',
        command: () => {
          this.importFileExel();
        }
      },
    ]
  }

  getCustObjectListNew() {
    const opts1 = { params: new HttpParams({ fromString: `objKey=contract_status` }) };
    this.apiService.getCustObjectListNew(null, opts1.params.toString()).subscribe(results => {
      this.statusContracts = results.data.map(d => {
        return {
          label: d.objName,
          value: d.objValue
        }
      });
      this.statusContracts = [{ label: 'Tất cả', value: null }, ...this.statusContracts]
    });
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
      if (this.gridColumnApi.columnModel.bodyWidth < this.gridColumnApi.columnModel.scrollWidth) {
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

  getContractTypes() {
    if (this.query.organizeId) {
      const queryParams = queryString.stringify({ organizeId: this.query.organizeId });
      this.apiService.getContractTypes(queryParams).subscribe(results => {
        if (results.status === 'success') {
          this.typeContracts = results.data.map(d => {
            return {
              label: d.contractTypeName,
              value: `${d.contractTypeId}`
            }
          });
          this.typeContracts = [{ label: 'Tất cả', value: null }, ...this.typeContracts];
        }
      })
    }
  }
  modelPrint = {
    PrinterName: null,
    Copies: 1
  }
  soLanIn = [
    { label: 'Một lần', value: 1 },
    { label: 'Hai lần', value: 2 },
    { label: 'Ba lần', value: 3 },
    { label: 'Bốn lần', value: 4 },
    { label: 'Năm lần', value: 5 },

  ]
  listRowSelects = []
  filesPrints = [];
  displayPrint = false;
  dataPrint = null;
  Prints() {
    let letPrint = this.listRowSelects.some((value) => {
      return value.contract_value === 0;
    });
    if (letPrint) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không in trạng thái "mới tạo", vui lòng không chọn trạng thái mới tạo' });;
      return;
    }
    const params = this.listRowSelects.map((item, index) => {
      return {
        key: item.contractId,
        data: null,
        seq: index + 1
      }
    })
    this.apiService.getPrintFiles(params).subscribe(results => {
      if (results.status === 'success') {
        this.filesPrints = results.data.dataList.data;
        this.dataPrint = results.data;
        this.initGridPrint();
        this.displayPrint = true;
      }

    })
  }
  rowSelected(event) {
    this.listRowSelects = event;
    if (this.listRowSelects.length > 0) {
      this.isShowbtnPheDuyet = false;
    } else {
      this.isShowbtnPheDuyet = true;
    }
  }

  pheDuyetHopDong() {
    if (this.listRowSelects.length > 0) {
      this.paramsPheDuyet = this.listRowSelects.map(d => {
        return {
          contractId: d.contractId,
          fullName: d.fullName,
          contract_no: d.contract_no,
          status: 1,
          comment: d.contractId
        }
      })
      this.apiService.setListContractStatus(this.paramsPheDuyet).subscribe((res: any) => {
        if (res.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: res.data ? res.data : '' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: res.message });
        }
      });
    }
  }

  openPrint() {
    this.isPrinted = true;
    let filesPrints = [];
    for(let item of this.filesPrints) {
      filesPrints = [...item.contractFiles]
    }
    const data = {
      "action": "PRINT",
      "data": {
        "PrinterName": this.modelPrint.PrinterName,
        "Copies": this.modelPrint.Copies,
        "Files": filesPrints.map(d => {
          return {
            "Filename": d.filename,
            "Url": d.url,
            "Type": d.type
          }
        })
      }
    }
    this.spinner.show();
    this.webSocketService.send(data);
    this.webSocketService.myWebSocket
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        repon => {
          if (this.isPrinted) {
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'In thành công' });
            this.load();
            this.isPrinted = false;
          }

        },
        err => {
          if (this.isPrinted) {
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'In Lỗi' });
            this.isPrinted = false;
          }
        },
      )
  }

  initGridPrint() {
    this.columnDefsPrint = [
      ...AgGridFn(this.dataPrint.gridflexs.filter((d: any) => !d.isHide)),
      ]

      this.detailCellRendererParams = {
        detailGridOptions: {
          frameworkComponents: {},
          getRowHeight: (params) => {
            return 40;
          },
          columnDefs: [
            ...AgGridFn(this.dataPrint.detailGrid),
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
          params.successCallback(params.data.contractFiles);
        },
        excelStyles: [
          {
            id: 'stringType',
            dataType: 'string'
          }
        ],
        template: function (params) {
          var personName = params.data.empName;
          return (
            '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
            `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách đính kèm (${params.data.contractFiles.length}) : [` +
            personName + ']' +
            '</div>' +
            '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
            '</div>'
          );
        },
      };
  }


  importFileExel() {
    this.router.navigate(['/nhan-su/xu-ly-hop-dong/import']);
  }

  displayApproveContract = false
  duyetHoSo() {
    this.spinner.show();
    let params = {...this.modelDuyetHopDong};
    delete params.type;
    this.apiService.setContractStatus(params)
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.displayApproveContract = false;
        this.load();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }

  cancelContract() {
    this.spinner.show();
    this.apiService.setContractCancel({
      contractId: this.modelDuyetHopDong.contractId
    }).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.load();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }

  getQueryLocalSotrage() {
    let queryLocal: any = JSON.parse(localStorage.getItem('queryXLHD'));
    if(queryLocal) {
      this.query.filter = queryLocal.filter;
      this.query.organizeId = queryLocal.organizeId;
      this.query.contract_st = queryLocal.contract_st;
      this.query.contractTypeId = queryLocal.contractTypeId;
      this.query.fromDate = new Date(queryLocal.fromDate);
      this.query.toDate = new Date(queryLocal.toDate);
    }
  }

  // query from storage
  queryStorage: any = { }
  setQueryLocalStorage() {
    this.queryStorage.filter = this.query.filter;
    this.queryStorage.organizeId = this.query.organizeId;
    this.queryStorage.contract_st = this.query.contract_st;
    this.queryStorage.contractTypeId = this.query.contractTypeId;
    this.queryStorage.fromDate = moment(new Date(this.query.fromDate)).format('YYYY-MM-DD');
    this.queryStorage.toDate = moment(new Date(this.query.toDate)).format('YYYY-MM-DD');

    localStorage.setItem('queryXLHD', JSON.stringify(this.queryStorage))
  }

}



