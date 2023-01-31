import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent implements OnInit {
  @Input() contractId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';
  files = null
  displayuploadcontract = false;
  ngOnInit(): void {
    this.getContractMetaPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  
  DeleteMeta(event) {

  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }


  getContractMetaPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ contractId: this.contractId, offSet: 0, pageSize: 10000 });
    this.apiService.getContractMetaPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid('columnDefs', repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_hopdong`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          console.log("sdsdsd")
          this.addContract()
        });
      }
    }, 300);
  }

  addContract() {
    this.getContractRecord();
  }

  initGrid(columnDefs ,gridflexs) {
    this[columnDefs] = [
      ...AgGridFn(gridflexs || []),
      columnDefs === 'columnDefs' ? {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_hopdong"> <span class="pi pi-upload action-grid-add" ></span></button>`,
        },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.dowloadFile.bind(this),
                label: 'Xem File',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              // {
              //   onClick: this.uploadContract.bind(this),
              //   label: 'Tải lên file ký duyệt',
              //   icon: 'pi pi-upload',
              //   key: 'view-job-detail',
              //   class: 'btn-primary mr5',
              // },

            
            ]
          };
        },
      } : {
        
        field: 'gridflexdetails12',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.dowloadFile.bind(this),
                label: 'Tải về file mẫu',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.uploadFile.bind(this),
                label: 'Tải lên file ký duyệt',
                icon: 'pi pi-upload',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  dowloadFile({rowData}) {
    this.downloadButtonClicked(rowData.temp_view_url)
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  trainId = null;
  editRow({rowData}) {
    this.trainId = rowData.metaId
    // this.getTrainFile();
  }
  columnDefsRecord = [];
  listsDataRecord = [];
  dataDetailInfo = null;
  displayFormEditDetail =false;
  getContractRecord() {
    this.columnDefsRecord = [];
    const queryParams = queryString.stringify({ contractId: this.contractId});
    this.apiService.getContractRecord(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listsDataRecord = results.data.records || [];
        this.dataDetailInfo = results.data;
        this.initGrid('columnDefsRecord',results.data.gridflexdetails1);
        this.displayFormEditDetail = true;
      } else {
        this.spinner.hide();
      }
    })
  }

  saveContractRecord() {
    const params = {
      gridflexdetails1: this.dataDetailInfo.gridflexdetails1,
      records: this.listsDataRecord
    }
    this.apiService.setContractRecord(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getContractMetaPage();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  }
  metafile = null;
  uploadFile(event) {
    this.metafile = event.rowData;
    this.displayuploadcontract = true;
  }

  
  handleUpload(event) {
    if(event && event.length > 0) {
      this.columnDefsRecord = [];
      let params = {...this.metafile}
      params.meta_file_url = event[0].url;
      params.meta_file_name = event[0].name;
      params.meta_file_type = event[0].type;
      params.meta_file_size = event[0].size;
      const indexObj = this.listsDataRecord.findIndex(d => d.metaId === params.metaId);
      this.listsDataRecord[indexObj] = params;
      this.listsDataRecord = [...this.listsDataRecord];
      this.initGrid('columnDefsRecord',this.dataDetailInfo.gridflexdetails1);
      this.displayuploadcontract = false;
    }
  }


  delRow(event) {
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
    //   accept: () => {
    //     const queryParams = queryString.stringify({trainId: event.rowData.trainId});
    //     this.apiService.delTrainFile(queryParams).subscribe((results: any) => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
    //         this.getContractMetaPage();
    //         this.FnEvent();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  getFilesDetail(event) {
    this.files = event;
  }

}
