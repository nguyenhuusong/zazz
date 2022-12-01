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
  selector: 'app-quan-he-lao-dong-c',
  templateUrl: './quan-he-lao-dong-c.component.html',
  styleUrls: ['./quan-he-lao-dong-c.component.scss']
})
export class QuanHeLaoDongCComponent implements OnInit {
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
    this.getContractPageByEmpId();
    this.getSalaryInfoPageByEmpId();

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
    this.apiService.getEmpByContract(queryParams).subscribe(results => {
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

  getSalaryInfoPageByEmpId() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalaryInfoPageByEmpId(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        this.columnDefs1 = [...AgGridFn(repo.data.gridflexs || [])];
        this.listsData1 = repo.data.dataList.data || [];
        if (repo.data.dataList.gridKey) {
          this.gridKey1 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  reloadGetEmpTrainPage() {
    if(this.gridKeyForm.index === 0) {
      this.getContractPageByEmpId();
    }else {
      this.getSalaryInfoPageByEmpId();
    }
  }

  setEmployeeInfo(data) {
    const params = {
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
  modelContractInfo = {
    contractId: null,
    empId: null,
    detailInfo: null,
    contractTypeId: null,
  }
  taohopdong(e) {
    this.modelContractInfo = {
      detailInfo: this.detailInfo,
      contractId: this.detailInfo.contractId || null,
      empId: this.detailInfo.empId,
      contractTypeId: null,
    }
    this.hienthihopdong = true;
  }
  hienthihopdong = false;
  emitContract(event) {
    this.hienthihopdong = false;
    this.getEmployeeInfo();
  }
  columnDefs = [];
  listsData = [];
  columnDefs1 = [];
  listsData1 = [];
  gridKey = '';
  gridKey1 = '';
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }
  displaySetting = false;
  CauHinh(type) {
    this.gridKeyForm = {
      index : type,
      gridKey: type === 0 ? this.gridKey : this.gridKey1
    }
    this.displaySetting = true;
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
                    onClick: this.XemQuaTrinhHopDong.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-qua-trinh-hop-dong',
                    class: 'btn-primary mr5',
                  },
                  {
                    onClick: this.duyetHopDong.bind(this),
                    label: 'Duyệt hợp đồng',
                    icon: 'pi pi-check',
                    key: 'duyet-hop-dong',
                    class: 'btn-danger',
                  },
                  {
                    onClick: this.XoaQuaTrinhHopDong.bind(this),
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
  modelDuyetHopDong = {
    contractId: null,
    status: 1,
    comment: ''
  }

  XoaQuaTrinhHopDong(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực xóa hợp đồng?',
      accept: () => {
        const queryParams = queryString.stringify({ contractId: event.rowData.contractId });
        this.apiService.delContractInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa hợp đồng thành công' });
            this.getEmployeeInfo();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  XemQuaTrinhHopDong(event) {
    this.modelContractInfo = {
      contractId: event.rowData.contractId,
      contractTypeId: event.rowData.contractTypeId,
      empId: this.detailInfo.empId,
      detailInfo: this.detailInfo,
    }
    this.hienthihopdong = true;
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
          this.getEmployeeInfo();
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
        this.getEmployeeInfo();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }






}


