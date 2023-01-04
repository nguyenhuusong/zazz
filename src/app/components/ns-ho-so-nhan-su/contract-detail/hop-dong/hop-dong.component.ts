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

  handleUpload(datas) {
    if (datas.length > 0) {
      const indexobj = this.listsData.findIndex(d => d.sourceId === this.record.sourceId);
      let record = { ... this.listsData[indexobj] };
      record.meta_file_url = datas[0].url;
      record.meta_file_type = datas[0].type;
      record.meta_file_size = datas[0].size;
      record.meta_file_name = datas[0].name;
      this.listsData[indexobj] = record;
      this.listsData = [... this.listsData];
      this.displayuploadcontract = false;
      this.saveCreateContract();
    }
  }
  saveCreateContract() {
    // this.spinner.show();
    // this.apiService.setRecordInfo(this.listViewsRecordInfo).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
    //     this.displayuploadcontract = false;
    //     this.getContractMetaPage();
    //     this.spinner.hide();
    //   } else {
    //     this.spinner.hide();
    //   }
    // })
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
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_kynang"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
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
              {
                onClick: this.dowloadFile.bind(this),
                label: 'Xem File',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.uploadContract.bind(this),
                label: 'Tải lên file ký duyệt',
                icon: 'pi pi-upload',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },

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
