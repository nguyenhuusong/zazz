import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn } from 'src/app/common/function-common/common';
import { WebsocketService2 } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import {  takeUntil , fromEvent, Subject} from 'rxjs';
@Component({
  selector: 'app-qua-trinh-hop-dong',
  templateUrl: './qua-trinh-hop-dong.component.html',
  styleUrls: ['./qua-trinh-hop-dong.component.scss']
})
export class QuaTrinhHopDongComponent implements OnInit {
  @Input() empId = null;
  @Input() detailInfo = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private webSocketService: WebsocketService2,
    private confirmationService: ConfirmationService,
  ) { 
    this.webSocketService.connect(environment.socketServer);
    this.webSocketService.emit("action", 'PRINT_LIST_PRINTERS')
  }
  listsData = [];
  columnDefs = [];
  gridKey = '';
  
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.webSocketService.closeConnection();
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.taohopdong()
        });
      }
    }, 300);
  }
  listPrints = [];
  ngOnInit(): void {
    this.getContractPageByEmpId();
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
  }

  cancelPopupContract() {
    this.hienthihopdong = false;
    this.cancelSave.emit()
  }

  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  modelContractInfo = {
    contractId: null,
    empId: null,
    detailInfo: null,
    contractTypeId: null,
    themmoi: false
  }
  isShowbtnPheDuyet = true;
  hienthihopdong = false;
  taohopdong() {
    this.modelContractInfo = {
      detailInfo: this.detailInfo,
      contractId: null,
      empId: this.detailInfo.empId,
      contractTypeId: null,
      themmoi: true
    }
    this.hienthihopdong = true;
  }

  emitContract(event) {
    this.hienthihopdong = false;
    this.getContractPageByEmpId();
    this.cancelSave.emit();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  addEmpPersonal() {
    const queryParams = queryString.stringify({ empId: this.empId});
    this.listViewsDetail = [];
    this.apiService.addEmpPersonal(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setDetailInfo(data) {
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.empproFileSetEmpAttach(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getContractPageByEmpId();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getContractPageByEmpId() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getContractPageByEmpId(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.addEmpPersonal();
    }else {
      this.displayFormEditDetail = false;
      this.getContractPageByEmpId();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 100,
        pinned: 'right',
        cellClass: ['border-right', 'no-auto'],
        field: 'gridflexdetails1',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.editRow.bind(this),
                label: 'Xem chi tiết',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              // {
              //   onClick: this.duyetHopDong.bind(this),
              //   label: 'Duyệt hợp đồng',
              //   icon: 'pi pi-check',
              //   key: 'duyet-hop-dong',
              //   class: 'btn-danger',
              // },
              {
                onClick: this.delRow.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                key: 'delete-qua-trinh-hop-dong',
                class: 'btn-danger',
              },
            ]
          };
        },
      }
    ];
  }

  modelDuyetHopDong = {
    contractId: null,
    status: 1,
    comment: ''
  }

  editRow({rowData}) {
    this.modelContractInfo = {
      contractId: rowData.contractId,
      contractTypeId: rowData.contractTypeId,
      empId: this.detailInfo.empId,
      detailInfo: this.detailInfo,
      themmoi: false
    }
    this.hienthihopdong = true;
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  displayApproveContract = false;
  duyetHopDong(event) {
    this.modelDuyetHopDong.contractId = event.rowData.contractId;
    this.modelDuyetHopDong.comment = '';
    this.displayApproveContract = true;
  }

  duyetHoSo() {
    this.spinner.show();
    this.apiService.setContractStatus(this.modelDuyetHopDong)
      .subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.displayApproveContract = false;
          this.getContractPageByEmpId();
          this.FnEvent();
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
        this.getContractPageByEmpId();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({contractId: event.rowData.contractId});
        this.apiService.delContractInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getContractPageByEmpId();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
  listRowSelects = [];
  rowSelected(event) {
    this.listRowSelects = event;
    if (this.listRowSelects.length > 0) {
      this.isShowbtnPheDuyet = false;
    } else {
      this.isShowbtnPheDuyet = true;
    }
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

  columnDefsPrint = []
  filesPrints = [];
  displayPrint = false;
  dataPrint = null;
  Prints() {
    this.columnDefsPrint = []
    let letPrint = this.listRowSelects.some((value) => {
      return value.contract_value === 0;
    });
    // if (letPrint) {
    //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không in trạng thái "mới tạo", vui lòng không chọn trạng thái mới tạo' });;
    //   return;
    // }
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
  detailCellRendererParams = null;
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

  modelPrint = {
    PrinterName: null,
    Copies: 1
  }

  isPrinted = false
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
            this.getContractPageByEmpId();
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

  



}
