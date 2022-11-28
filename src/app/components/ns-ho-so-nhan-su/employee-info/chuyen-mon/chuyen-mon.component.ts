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
  selector: 'app-chuyen-mon',
  templateUrl: './chuyen-mon.component.html',
  styleUrls: ['./chuyen-mon.component.scss']
})
export class ChuyenMonComponent implements OnInit {
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
    this.getEmpQualification();
    this.getEmpWorkedPage();
    this.getEducationPage();
    this.getTrainningPage();
    this.getSkillPage();
    this.getCertificatePage();

  }

  cancelEmpTrainInfo(data) {
    if (data === 'CauHinh') {
      if (this.vitri === 0) {
        this.getEmpWorkedPage()
      } else if (this.vitri === 1) {
        this.getEducationPage()
      } else if (this.vitri === 2) {
        this.getTrainningPage();
      } else if (this.vitri === 3) {
        this.getTrainningPage();
      } else {
        this.getCertificatePage();
      }
    } else {
      this.displayFormEmpTrain = false;
    }

  }
  columnDefs1 = [];
  listsData1 = [];
  columnDefs2 = [];
  listsData2 = [];
  gridKey2 = '';
  columnDefs3 = [];
  listsData3 = [];
  gridKey3 = '';
  columnDefs4 = [];
  listsData4 = [];
  gridKey4 = '';
  getCertificatePage() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getCertificatePage(queryParams).subscribe(repo => {
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
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.CertificateView.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.CertificateDelete.bind(this),
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
  getTrainningPage() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getTrainningPage(queryParams).subscribe(repo => {
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
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.TrainningView.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.TrainningDelete.bind(this),
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
  getSkillPage() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getSkillPage(queryParams).subscribe(repo => {
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
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.SkillView.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.SkillDelete.bind(this),
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
  getEducationPage() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEducationPage(queryParams).subscribe(repo => {
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
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.EducationView.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.EducationDelete.bind(this),
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
        this.listsData1 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  EducationDelete(event) {
    this.vitri = 1;
    this.trainId = event.rowData.metaId
    this.delTrainFile()
  }

  TrainningDelete(event) {
    this.vitri = 2;
    this.trainId = event.rowData.metaId
    this.delTrainFile()
  }

  CertificateDelete(event) {
    this.vitri = 4;
    this.trainId = event.rowData.metaId
    this.delTrainFile()
  }

  SkillDelete(event) {
    this.vitri = 3;
    this.trainId = event.rowData.metaId
    this.delTrainFile()
  }

  delTrainFile() {
    const queryParams = queryString.stringify({ trainId: this.trainId });
    this.apiService.delTrainFile(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        if (this.vitri === 1) {
          this.getEducationPage();
        } else if (this.vitri === 2) {
          this.getTrainningPage();
        } else if (this.vitri === 3) {
          this.getSkillPage();
        }
      }
    })
  }

  trainId = null;
  vitri = 0
  EducationView(event) {
    this.trainId = event.rowData.metaId;
    this.vitri = 1;
    this.titleEmpTrain = 'Thông tin quá trình học vấn';
    this.getTrainFile()
  }

  TrainningView(event) {
    this.trainId = event.rowData.metaId;
    this.vitri = 2;
    this.titleEmpTrain = 'Thông tin quá trình đào tạo';
    this.getTrainFile()
  }

  SkillView(event) {
    this.trainId = event.rowData.metaId;
    this.vitri = 3;
    this.titleEmpTrain = 'Thông tin chi tiết kỹ năng';
    this.getTrainFile()
  }
  CertificateView(event) {
    this.trainId = event.rowData.metaId;
    this.vitri = 4;
    this.titleEmpTrain = 'Thông tin chi tiết Chứng chỉ';
    this.getTrainFile()
  }

  getTrainFile() {
    this.spinner.show();
    const queryParams = queryString.stringify({ trainId: this.trainId });
    this.apiService.getTrainFile(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  getEmpWorkedPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpWorkedPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.GetEmpWorkedView.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.DelEmpWorked.bind(this),
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
        this.listsData = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  apiEmpTrainInfo = '';
  listViewsEmpTrain = [];
  detailEmpTrainInfo = null;
  titleEmpTrain = '';
  displayFormEmpTrain = false;

  GetEmpWorkedView(event) {
    this.vitri = 0;
    this.titleEmpTrain = 'Thông tin quá trình làm việc';
    this.idEmpWorked = event.rowData.id;
    this.GetEmpWorked()
  }

  idEmpWorked = null;
  GetEmpWorked() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId, id: this.idEmpWorked });
    this.apiService.getEmpWorked(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  AddEducation() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.addEducation(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  AddTraining() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.addTraining(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  AddSkill() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.addSkill(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  AddCertificate() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.addCertificate(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.listViewsEmpTrain = result.data.group_fields;
        this.detailEmpTrainInfo = result.data;
        this.displayFormEmpTrain = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  setEmpTrain(data) {
    if (this.vitri === 0) {
      this.spinner.show();
      const params = {
        ...this.detailEmpTrainInfo, group_fields: data
      }
      this.apiService.setEmpWorked(params).subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.getEmpWorkedPage();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      }, error => {
      });
    } else {
      this.spinner.show();
      const params = {
        ...this.detailEmpTrainInfo, group_fields: data
      }
      this.apiService.setTrainFile(params).subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          if (this.vitri === 1) {
            this.getEducationPage()
          } else if (this.vitri === 2) {
            this.getTrainningPage();
          } else if (this.vitri === 3) {
            this.getTrainningPage();
          } else {
            this.getCertificatePage();
          }
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
  }

  DelEmpWorked(event) {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.delEmpWorked(queryParams).subscribe(result => {
      if (result.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: result.message });
        this.getEmpWorkedPage();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }


  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  getEmpQualification(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpQualification(queryParams).subscribe(results => {
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


  setEmpQualification(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpQualification(params).subscribe((results: any) => {
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
      this.getEmpQualification();
    } else {

    }
  }

  columnDefs = [];
  listsData = [];
  gridKey = '';
  gridKey1 = '';
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }
  displaySetting = false;
  CauHinh(type) {
    this.gridKeyForm = {
      index: type,
      gridKey: type === 0 ? this.gridKey : type === 1 ? this.gridKey1 : type === 2 ? this.gridKey2 : type === 3 ? this.gridKey3 : this.gridKey4
    }
    this.displaySetting = true;
  }

  reloadGetEmpTrainPage() {
    if (this.gridKeyForm.index === 0) {
      this.getEmpWorkedPage()
    } else if (this.gridKeyForm.index === 1) {
      this.getEducationPage()
    } else if (this.gridKeyForm.index === 2) {
      this.getTrainningPage();
    } else if (this.gridKeyForm.index === 3) {
      this.getTrainningPage();
    } else {
      this.getCertificatePage();
    }
  }
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]

  addWorked() {
    this.vitri = 0;
    this.titleEmpTrain = 'Thêm mới thông tin quá trình làm việc';
    this.idEmpWorked = null;
    this.GetEmpWorked()
  }

  addEducation() {
    this.vitri = 1;
    this.titleEmpTrain = 'Thêm mới thông tin quá trình học vấn';
    this.AddEducation()
  }

  addTraining() {
    this.vitri = 2;
    this.titleEmpTrain = 'Thêm mới thông tin quá trình đào tạo';
    this.AddTraining()
  }

  addSkill() {
    this.vitri = 3;
    this.titleEmpTrain = 'Thêm mới thông tin kỹ năng';
    this.AddSkill()
  }

  addCertificate() {
    this.vitri = 4;
    this.titleEmpTrain = 'Thêm mới thông tin chứng chỉ';
    this.AddCertificate()
  }
}



