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
  @Input() dataEmployeeStatus = null
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
    this.getEmpIdcardPage();
    this.getEmpRecordPage();
    this.getEmpPersonalPage();
    this.getEmpContactPage();

  }

  reloadGetEmpProfilePage() {
    console.log(this.gridKeyForm)
    if (this.gridKeyForm.index === 1) {
      this.getEmpIdcardPage()
    } else if (this.gridKeyForm.index === 2) {
      this.getEmpRecordPage();
    } else if (this.gridKeyForm.index === 3) {
      this.getEmpPersonalPage();
    } else {
      this.getEmpContactPage();
    }
  }

  getEmpContactPage() {
    this.spinner.show();
    this.columnDefs4 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpContactPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey4 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs4 = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            headerComponentParams: {
              template:
                `<button  class="btn-button" id="${this.gridKey4}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
            },
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.xemLienHe.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.xoaLienHe.bind(this),
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
        this.listsData4 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  getEmpPersonalPage() {
    this.spinner.show();
    this.columnDefs3  = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpPersonalPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey3 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs3 = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            headerComponentParams: {
              template:
                `<button  class="btn-button" id="${this.gridKey3}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
            },
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  // {
                  //   onClick: this.xemDinhKem.bind(this),
                  //   label: 'Xem chi tiết',
                  //   icon: 'fa fa-edit editing',
                  //   key: 'view-qua-trinh-hop-dong',
                  //   class: 'btn-primary mr5',
                  // },
                  {
                    onClick: this.xoaDinhKem.bind(this),
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
        this.listsData3 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  getEmpRecordPage() {
    this.spinner.show();
    this.columnDefs2 = []
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpRecordPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey2 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs2 = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            headerComponentParams: {
              template:
              `<button  class="btn-button" id="${this.gridKey2}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
            },
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  // {
                  //   onClick: this.xemHSCN.bind(this),
                  //   label: 'Xem chi tiết',
                  //   icon: 'fa fa-edit editing',
                  //   key: 'view-qua-trinh-hop-dong',
                  //   class: 'btn-primary mr5',
                  // },

                  {
                    onClick: this.xoaHSCN.bind(this),
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
        this.listsData2 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  

  getEmpIdcardPage() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpIdcardPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey1 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs1 = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            headerComponentParams: {
              template:
              `<button  class="btn-button" id="${this.gridKey1}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
            },
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  // {
                  //   onClick: this.EducationView.bind(this),
                  //   label: 'Xem chi tiết',
                  //   icon: 'fa fa-edit editing',
                  //   key: 'view-qua-trinh-hop-dong',
                  //   class: 'btn-primary mr5',
                  // },

                  // {
                  //   onClick: this.EducationDelete.bind(this),
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
        this.listsData1 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  optionsButtonsView = [
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
    this.apiService.getEmpProfile(queryParams).subscribe(results => {
      if (results.status === 'success') {
        if (!this.codeStaff) {
          this.codeStaff = getFieldValueAggrid(results.data, 'code');
        }
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
  }

  displayuploadcontract = false;
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  setEmployeeInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpProfile(params).subscribe((results: any) => {
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
    } else if (button === 'xuatHoSo') {
      this.exportResume();
    }
  }

  exportResume() {
    this.spinner.show();
    this.apiService.exportResume(queryString.stringify({ empId: this.detailInfo.empId })).subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else if (results.type === 'application/octet-stream') {
        var blob = new Blob([results], { type: 'application/msword' });
        FileSaver.saveAs(blob, `Thông tin hồ sơ cá nhân` + ".docx");
        this.spinner.hide();
      }
    })
  }

  // dùng cho các phần Giấy tờ tùy thân, Thông tin hồ sơ cá nhân, Danh sách đính kèm, Danh sách thông tin người liên hệ
  // @listViewsPart
  // @detailInfoPart
  listViewsPart = [];
  detailInfoPart = null;
  isShowFileHSCN = false;
  themMoiThongTinHSCN() {
    this.spinner.show();
    this.listViewsPart = [];
    this.detailInfoPart = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.addEmpRecord(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.isShowFileHSCN = true;
        this.listViewsPart = cloneDeep(results.data.group_fields || []);
        this.detailInfoPart = results.data;
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  xemHSCN() {
    
  }

  setFileHSCN(data) {
    this.spinner.show();
    let theData = data
    theData.forEach(group => {
      group.fields.forEach(field => {
        if(field.field_name === "meta_file_name" && this.fileUpload && this.fileUpload.length > 0) {
          field.columnValue = this.fileUpload[0].name
        }
      });
    });
    const  params = {
      ...this.detailInfoPart, group_fields: theData
    };
    this.apiService.empproFileSetEmpAttach(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.getEmpRecordPage();
        this.isShowFileHSCN = false;
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }
  fileUpload: any = []
  getFileHSCN(event) {
    this.fileUpload = event
  }

  xoaHSCN(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa đính kèm này?',
      accept: () => {
        const queryParams = queryString.stringify({ metaId: event.rowData.metaId });
        this.apiService.empproFileDelEmpAttach(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpRecordPage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  canceFileHSCN(event) {
    this.isShowFileHSCN = false;
  }

  
  // listViewsDinhKem = [];
  // detailInfoDinhKem = null;
  isShowDinhKem = false;
  themMoiDinhKem(empId = this.empId) {
    this.spinner.show();
    this.listViewsPart = [];
    this.detailInfoPart = null;
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.addEmpPersonal(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.isShowDinhKem = true;
        this.listViewsPart = cloneDeep(results.data.group_fields || []);
        this.detailInfoPart = results.data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  xemDinhKem(event){
    this.themMoiDinhKem(event.rowData.empId);
  }

  setDinhKem(data) {
    this.spinner.show();
    const  params = {
      ...this.detailInfoPart, group_fields: data
    };
    this.apiService.empproFileSetEmpAttach(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.getEmpPersonalPage();
        this.isShowDinhKem = false;
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  xoaDinhKem(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa đính kèm này?',
      accept: () => {
        const queryParams = queryString.stringify({ metaId: event.rowData.metaId });
        this.apiService.empproFileDelEmpAttach(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpPersonalPage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  canceDinhKem(event) {
    this.isShowDinhKem = false;
  }

  // listViewsLienHe = [];
  // detailInfoLienHe = null;
  isShowLienHe = false;
  themLienHe(empId = this.empId, cont_id = null) {
    this.spinner.show();
    this.listViewsPart = [];
    this.detailInfoPart = null;
    const queryParams = queryString.stringify({ empId: empId, cont_id: cont_id });
    this.apiService.empProfileGetEmpContact(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.isShowLienHe = true;
        this.listViewsPart = cloneDeep(results.data.group_fields || []);
        this.detailInfoPart = results.data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  xemLienHe(event) {
    this.themLienHe(this.empId, event.rowData.cont_id);
  }

  setLienHe(data) {
    this.spinner.show();
    const  params = {
      ...this.detailInfoPart, group_fields: data
    };
    this.apiService.empProfileSetEmpContact(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.getEmpContactPage();
        this.isShowLienHe = false;
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  xoaLienHe(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa liên hệ này?',
      accept: () => {
        const queryParams = queryString.stringify({ cont_id: event.rowData.cont_id });
        this.apiService.delEmpContact(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpContactPage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  canceLienHe(event) {
    this.isShowLienHe = false;
  }

  isEditDetail = false;
  editDetail() {
    this.isEditDetail = true;
  }

  cancelSetDetail(event) {
    this.isEditDetail = false;
  }


  columnDefs1 = [];
  listsData1 = [];
  columnDefs2 = [];
  listsData2 = [];
  gridKey2 = '';
  gridKey1 = '';
  columnDefs3 = [];
  listsData3 = [];
  gridKey3 = '';
  columnDefs4 = [];
  listsData4 = [];
  gridKey4 = '';
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }

  displaySetting = false;
  CauHinh(type) {
    this.gridKeyForm = {
      index: type,
      gridKey: type === 1 ? this.gridKey1 : type === 2 ? this.gridKey2 : type === 3 ? this.gridKey3 : type === 4 ? this.gridKey4 : this.gridKey4
    }
    this.displaySetting = true;
  }
}

