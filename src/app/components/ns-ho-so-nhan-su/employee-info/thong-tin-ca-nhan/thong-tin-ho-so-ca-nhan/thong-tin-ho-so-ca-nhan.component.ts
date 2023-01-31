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
  selector: 'app-thong-tin-ho-so-ca-nhan',
  templateUrl: './thong-tin-ho-so-ca-nhan.component.html',
  styleUrls: ['./thong-tin-ho-so-ca-nhan.component.scss']
})
export class ThongTinHoSoCaNhanComponent implements OnInit {
  @Input() empId = null;
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
  listsDataRecord = [];
  columnDefsRecord = [];
  gridKey = '';
  gridKeyRecord = '';

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  
  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.themMoiThongTinHSCN()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getEmpRecordPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  cont_id = null
  themMoiThongTinHSCN() {
    this.getEmpRecord();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpRecord() {
    this.columnDefsRecord = [];
    const queryParams = queryString.stringify({ empId: this.empId});
    this.listViewsDetail = [];
    this.apiService.getEmpRecord(queryParams).subscribe(results => {
      if (results.status === 'success') {
        // if (results.data.dataList.gridKey) {
        //   this.gridKeyRecord = results.data.dataList.gridKey;
        // }
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

  fileUpload: any = []
  getFileHSCN(event) {
    this.fileUpload = event
  }

  saveRecord() {
    const params = {
      gridflexdetails1: this.dataDetailInfo.gridflexdetails1,
      records: this.listsDataRecord
    }
    this.apiService.setEmpRecord(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getEmpRecordPage();
        this.FnEvent()
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  }

  setDetailInfo(data) {
    let newData = data
    newData.forEach(group => {
      group.fields.forEach(field => {
        if(field.field_name === "meta_file_name" && this.fileUpload && this.fileUpload.length > 0) {
          field.columnValue = this.fileUpload[0].name
        }
      });
    });
    const param = {
      ...this.dataDetailInfo, group_fields: newData
    }
    this.apiService.empproFileSetEmpAttach(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getEmpRecordPage();
        this.FnEvent()
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getEmpRecordPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpRecordPage(queryParams).subscribe(repo => {
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

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      // this.getEmpRecord();
    }else {
      this.displayFormEditDetail = false;
      this.getEmpRecordPage();
    }
  }

  initGrid(columnDefs,gridflexs) {
    this[columnDefs] = [
      ...AgGridFn(gridflexs || []),
      columnDefs === 'columnDefs' ?
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
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
                onClick: this.editRow.bind(this),
                label: 'Xem chi tiết',
                icon: 'fa fa-edit editing',
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
      } :  {
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.uploadFile.bind(this),
                label: 'Upload',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  uploadFile(event) {
    this.metafile = event.rowData;
    this.displayuploadcontract = true;
  }

  editRow(event) {
    this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chức năng đang phát triển'});
    // this.cont_id = event.rowData.cont_id;
    // this.getEmpRecord();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({metaId: event.rowData.metaId});
        this.apiService.empproFileDelEmpAttach(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpRecordPage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  metafile = null;
  displayuploadcontract = false;
  handleUpload(event) {
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
