import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-thoi-gian-lam-viec',
  templateUrl: './thoi-gian-lam-viec.component.html',
  styleUrls: ['./thoi-gian-lam-viec.component.scss']
})
export class ThoiGianLamViecComponent implements OnInit {
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
  gridKey = ''
  ngOnInit(): void {
    this.getEmpWorkingPageByEmpId();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  workingId = null
  addTimeWork() {
    this.workingId = null
    this.getEmpWorking();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpWorking() {
    const queryParams = queryString.stringify({ empId: this.empId, gd: this.workingId });
    this.listViewsDetail = [];
    this.apiService.getEmpWorking(queryParams).subscribe(results => {
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
    this.apiService.setEmpWorking(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getEmpWorkingPageByEmpId();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getEmpWorkingPageByEmpId() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpWorkingPageByEmpId(queryParams).subscribe(repo => {
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
      this.getEmpWorking();
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
          ` <span class="pi pi-plus" id="${this.gridKey}"></span>`
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

  editRow(event) {
    this.workingId = event.rowData.gd;
    this.getEmpWorking();
  }

  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({gd: event.rowData.gd});
        this.apiService.delEmpWorking(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpWorkingPageByEmpId();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}
