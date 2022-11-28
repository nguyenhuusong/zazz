import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { AgGridFn, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-thong-tin-ca-nhan',
  templateUrl: './thong-tin-ca-nhan.component.html',
  styleUrls: ['./thong-tin-ca-nhan.component.scss']
})
export class ThongTinCaNhanComponent implements OnInit {
  detailInfo = null;
  @Input() empId = null
  constructor(
    private apiService: ApiHrmService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmployeeInfo();

  }
  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeData('GetEmployeeByPersonal', queryParams).subscribe(results => {
      if (results.status === 'success') {
        if (!this.codeStaff) {
          this.codeStaff = getFieldValueAggrid(results.data, 'code');
        }
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.getRecordInfo();
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
  }

  listsDataRecord = []
  columnDefsRecord = [];
  listViewsRecordInfo = null;
  getRecordInfo() {
    this.columnDefsRecord = []
    const queryParams = queryString.stringify({ empId: this.detailInfo.empId });
    this.apiService.getRecordInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listsDataRecord = results.data.records || [];
        this.listViewsRecordInfo = results.data;
        this.columnDefsRecord = [
          ...AgGridFn(this.listViewsRecordInfo.gridflexdetails1 || [])
          , {
            headerName: 'Tải lên hồ sơ',
            field: 'button234',
            cellClass: ['border-right'],
            width: 100,
            pinned: 'right',
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.uploadContract.bind(this),
                    label: 'Tải lên hồ sơ',
                    icon: 'pi pi-cloud-download',
                    class: 'btn-primary mr5',
                    key: 'tailenhoso',
                  },
                  {
                    onClick: this.ViewContract.bind(this),
                    label: 'Xem hồ sơ',
                    icon: 'fa fa-edit',
                    key: 'xemhoso',
                    class: 'btn-primary mr5',
                  },
                  {
                    onClick: this.HuyHoSo.bind(this),
                    label: 'Hủy hồ sơ',
                    icon: 'pi pi-trash',
                    key: 'huyhosocanhan',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }];
      }
    });
  }

  displayuploadcontract = false;
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  HuyHoSo(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hủy hồ sơ này ?',
      accept: () => {
        const indexobj = this.listsDataRecord.findIndex(d => d.sourceId === event.rowData.sourceId);
        let record = { ... this.listsDataRecord[indexobj] };
        record.meta_file_url = "";
        record.meta_file_size = "";
        record.meta_file_name = "";
        record.meta_file_size_name = "";
        record.meta_file_type = "";
        this.listsDataRecord[indexobj] = record;
        this.listsDataRecord = [... this.listsDataRecord];
        this.listViewsRecordInfo.records = this.listsDataRecord;
        this.saveCreateContract();
      }
    });
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_file_url);
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
      const indexobj = this.listsDataRecord.findIndex(d => d.sourceId === this.record.sourceId);
      let record = { ... this.listsDataRecord[indexobj] };
      record.meta_file_url = datas[0].url;
      record.meta_file_type = datas[0].type;
      record.meta_file_size = datas[0].size;
      record.meta_file_name = datas[0].name;
      this.listsDataRecord[indexobj] = record;
      this.listsDataRecord = [... this.listsDataRecord];
      this.listViewsRecordInfo.records = this.listsDataRecord;
      this.displayuploadcontract = false;
      this.saveCreateContract();
    }

   
  }

  saveCreateContract() {
    this.spinner.show();
    this.apiService.setRecordInfo(this.listViewsRecordInfo).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
        this.displayuploadcontract = false;
        this.getEmployeeInfo();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  setEmployeeInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmployeeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
      
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  cancelUpdate(button) {
     if (button === 'CauHinh') {
      this.getEmployeeInfo();
    } else {

    }
  }


}

