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
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {
  @Input() contractTypeId = null;
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
  ngAfterViewInit(): void {
    this.FnEvent();
  }


  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_kynang`);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addSkill()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getContractTypeTemplatePage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  addSkill() {
    this.tempId = null
    this.getContractTypeTemplate();
  }
  tempId = null;
  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getContractTypeTemplate() {
    const queryParams = queryString.stringify({ contractTypeId: this.contractTypeId, tempId: this.tempId });
    this.listViewsDetail = [];
    this.apiService.getContractTypeTemplate(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setDetailInfo(data) {
    if (this.files && this.files.length > 0) {
      data[0].fields.forEach(element => {
        if (element.field_name === "meta_file_size") {
          element.columnValue = this.files[0].size
        } else if (element.field_name === "meta_file_type") {
          element.columnValue = this.files[0].type;
        }
        else if (element.field_name === "meta_file_name") {
          element.columnValue = this.files[0].name;
        }
      });
    }
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.setContractTypeTemplate(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getContractTypeTemplatePage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })

  }

  getContractTypeTemplatePage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ contractTypeId: this.contractTypeId, offSet: 0, pageSize: 10000 });
    this.apiService.getContractTypeTemplatePage(queryParams).subscribe(repo => {
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

  cancelDetailInfo(event) {
    if (event === 'CauHinh') {
      this.getContractTypeTemplate();
    } else {
      this.displayFormEditDetail = false
    }
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

              {
                onClick: this.editRow.bind(this),
                label: 'Xem chi tiết',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileDemo.bind(this),
                label: 'Dowload file',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.uploadFile.bind(this),
                label: 'Cập nhật file',
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
      }
    ];
  }

  dowloadFileDemo({ rowData }) {
    this.downloadButtonClicked(rowData.meta_file_tpl);
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }


  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  trainId = null;
  editRow({ rowData }) {
    this.tempId = rowData.tempId;
    this.getContractTypeTemplate();
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({ tempId: event.rowData.tempId });
        this.apiService.delContractTypeTemplate(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getContractTypeTemplatePage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  getFilesDetail(event) {
    this.files = event;

    const formData = new FormData()
  }
  detailRow = null;
  displayuploadcontract = false;

  handleUpload(event) {
    this.spinner.show();
    let fomrData = new FormData();
    fomrData.append('formFile', event[0].file);
    fomrData.append('tempId', this.tempId);
    fomrData.append('tpl_url', this.detailRow.tpl_url);
    this.apiService.uploadFileContract(fomrData).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'upload thành công' });
        this.getContractTypeTemplatePage();
        this.displayuploadcontract = false;
      }else {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Lỗi' });
      }
    })

  }

  uploadFile({ rowData }) {
    this.tempId = rowData.tempId;
    this.detailRow = rowData;
    this.displayuploadcontract = true;
  }
}
