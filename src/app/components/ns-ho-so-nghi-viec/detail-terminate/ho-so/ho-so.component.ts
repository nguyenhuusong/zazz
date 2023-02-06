import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { WebsocketService2 } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ho-so',
  templateUrl: './ho-so.component.html',
  styleUrls: ['./ho-so.component.scss']
})
export class HoSoComponent implements OnInit {
  @Input() terminateId = null;
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
  files = null
  listPrints = [];
  ngAfterViewInit(): void {
    this.FnEvent();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_worked`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addWorked()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getTerminateMetaPage();
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
  
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  metaId = null;
  addWorked() {
    this.metaId = null;
    this.getEmpAttachInsur();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpAttachInsur() {
    const queryParams = queryString.stringify({ terminateId: this.terminateId, metaId: this.metaId});
    this.listViewsDetail = [];
    this.apiService.getEmpAttachInsur(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }
  getFilesDetail(event) {
    this.files = event;
  }

  setDetailInfo(data) {
    if(this.files && this.files.length > 0){
      data[0].fields.forEach(element => {
        if(element.field_name === "meta_file_size") {
          element.columnValue = this.files[0].size
        }else if(element.field_name === "meta_file_type") {
          element.columnValue = this.files[0].type;
        }
        else if(element.field_name === "meta_file_name") {
          element.columnValue = this.files[0].name;
        }
      });
    }
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.setEmpAttachInsur(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getTerminateMetaPage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  theFileName(file){
    if(file){
      let fileName = file.split('/').pop().split('?')[0].split('-uninini-').pop();
      return fileName;
    }
  }
  
  getTerminateMetaPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ terminateId: this.terminateId, offSet: 0, pageSize: 10000 });
    this.apiService.getTerminateMetaPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data;
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.getEmpAttachInsur();
    }else {
      this.displayFormEditDetail = false
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        // headerComponentParams: {
        //   template:
        //   `<button  class="btn-button" id="${this.gridKey}_worked"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        // },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              // {
              //   onClick: this.editRow.bind(this),
              //   label: 'Xem chi tiết',
              //   icon: 'fa fa-edit editing',
              //   key: 'view-job-detail',
              //   class: 'btn-primary mr5',
              // },

              // {
              //   onClick: this.delRow.bind(this),
              //   label: 'Xóa',
              //   icon: 'pi pi-trash',
              //   key: 'delete-qua-trinh-hop-dong',
              //   class: 'btn-danger',
              // },
            ]
          };
        },
      }
    ];
  }

  editRow({rowData}) {
    this.metaId = rowData.metaId;
    this.getEmpAttachInsur();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({metaId: event.rowData.metaId});
        this.apiService.delEmpAttachInsur(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.getTerminateMetaPage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }


  
  columnDefsPrint = []
  filesPrints = [];
  displayPrint = false;
  dataPrint = null;
  Prints() {
    this.columnDefsPrint = []
    // let letPrint = this.listRowSelects.some((value) => {
    //   return value.contract_value === 0;
    // });
    // if (letPrint) {
    //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không in trạng thái "mới tạo", vui lòng không chọn trạng thái mới tạo' });;
    //   return;
    // }
    // const params = this.listRowSelects.map((item, index) => {
    //   return {
    //     key: item.contractId,
    //     data: null,
    //     seq: index + 1
    //   }
    // })
    this.apiService.getPrintFilesTerminate([{
      key: this.terminateId,
      data: null,
      seq: 1
    }]).subscribe(results => {
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
    console.log(filesPrints)
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
          console.log(repon)
          if (this.isPrinted) {
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'In thành công' });
            this.getTerminateMetaPage();
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
