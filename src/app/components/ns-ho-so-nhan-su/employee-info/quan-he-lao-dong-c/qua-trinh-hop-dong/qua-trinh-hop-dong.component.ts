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
  selector: 'app-qua-trinh-hop-dong',
  templateUrl: './qua-trinh-hop-dong.component.html',
  styleUrls: ['./qua-trinh-hop-dong.component.scss']
})
export class QuaTrinhHopDongComponent implements OnInit {
  @Input() empId = null;
  @Input() detailInfo = null;
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}`);
      const click$ = fromEvent(dragTarget, 'click');
      click$.subscribe(event => {
        this.taohopdong()
      });
    }, 300);
  }
  ngOnInit(): void {
    this.getContractPageByEmpId();
  }

  cancelPopupContract() {
    this.hienthihopdong = false;
    this.cancelSave.emit()
  }

  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  modelContractInfo = {
    contractId: null,
    empId: null,
    detailInfo: null,
    contractTypeId: null,
  }
  hienthihopdong = false;
  taohopdong() {
    this.modelContractInfo = {
      detailInfo: this.detailInfo,
      contractId: this.detailInfo.contractId || null,
      empId: this.detailInfo.empId,
      contractTypeId: null,
    }
    this.hienthihopdong = true;
  }

  emitContract(event) {
    this.hienthihopdong = false;
    this.getContractPageByEmpId();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  addEmpPersonal() {
    const queryParams = queryString.stringify({ empId: this.empId});
    this.listViewsDetail = [];
    this.apiService.addEmpPersonal(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setDetailInfo(data) {
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.empproFileSetEmpAttach(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getContractPageByEmpId();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
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
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.addEmpPersonal();
    }else {
      this.displayFormEditDetail = false
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
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
                onClick: this.duyetHopDong.bind(this),
                label: 'Duyệt hợp đồng',
                icon: 'pi pi-check',
                key: 'duyet-hop-dong',
                class: 'btn-danger',
              },
              {
                onClick: this.deleteRow.bind(this),
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

  modelDuyetHopDong = {
    contractId: null,
    status: 1,
    comment: ''
  }

  editRow(event) {
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
          this.getContractPageByEmpId();
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
        this.getContractPageByEmpId();
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        this.spinner.hide();
      }
    })
  }


  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({contractId: event.rowData.contractId});
        this.apiService.delContractInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getContractPageByEmpId();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}
