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
  selector: 'app-thue-bao-hiem',
  templateUrl: './thue-bao-hiem.component.html',
  styleUrls: ['./thue-bao-hiem.component.scss']
})
export class ThueBaoHiemComponent implements OnInit {
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
    this.getEmpDependentPage();

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
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeData('GetEmployeeByInsurance', queryParams).subscribe(results => {
      if (results.status === 'success') {
        if (!this.codeStaff) {
          this.codeStaff = getFieldValueAggrid(results.data, 'code');
        }
        this.listViews = cloneDeep(results.data.group_fields || []);
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
  columnDefs = [];
  gridKey = '';
  listsData = [];
  getEmpDependentPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpDependentPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        this.spinner.hide();
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }    this.columnDefs = [
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
                    onClick: this.ViewForm.bind(this),
                    label: 'Xem chi tiêt',
                    icon: 'fa fa-edit edittingg',
                    key: 'xemchitietlienhe',
                    class: 'btn-primary mr-1',
                  },
                  {
                    onClick: this.DeleteDependent.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'xoa-nguoi-phu-thuoc',
                    class: 'btn-danger',
                  },
                ]
              };
            },
          }];
          this.listsData = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }
  detailFormInfo = null;
  vitri = 0;
  titleEmpTrain = '';
  idFrom = null;
  displayFormEditDetail = false;
  ViewForm(event) {
    this.titleEmpTrain = 'Chỉnh sửa thông tin người phụ thuộc';
    this.vitri = 0;
    this.idFrom = event.rowData.dependentId;
    this.getEmpDependent()
  }


  DeleteDependent(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa người phụ thuộc này?',
      accept: () => {
        const queryParams = queryString.stringify({ dependentId: event.rowData.dependentId });
        this.apiService.delEmpDependent(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa người phụ thuộc thành công' });
            this.getEmpDependentPage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }
  displaySetting = false;
  CauHinh(type) {
    this.gridKeyForm = {
      index: type,
      gridKey: type === 0 ? this.gridKey : ''
    }
    this.displaySetting = true;
  }

  reloadGetEmpTrainPage() {
    if(this.gridKeyForm.index === 0) {
      this.getEmpDependentPage();
    }
  }

  addEmpDependent() {
    this.titleEmpTrain = 'Thêm mới người phụ thuộc';
    this.vitri = 0;
    this.idFrom = null;;
    this.getEmpDependent()
  }

  getEmpDependent() {
    const queryParams = queryString.stringify({ empId: this.detailInfo.empId, dependentId: this.idFrom });
    this.listViewsForm = [];
    this.apiService.getEmpDependent(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsForm = cloneDeep(results.data.group_fields);
        this.detailFormInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })

  }
  setFormInfo(event) {
    const param = {
      ...this.detailFormInfo, group_fields: event
    }
    this.spinner.show();
    if(this.vitri === 0) {
      this.apiService.setEmpDependent(param).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
          this.displayFormEditDetail = false;
          this.getEmployeeInfo();
          this.getEmpDependentPage();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      })
    }
  }

  cancelFormInfo(event) {
    if(event === 'Cancel') {
      this.displayFormEditDetail = false
    }
  }

}

