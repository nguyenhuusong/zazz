

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-qua-trinh-cong-tac',
  templateUrl: './qua-trinh-cong-tac.component.html',
  styleUrls: ['./qua-trinh-cong-tac.component.scss']
})
export class QuaTrinhCongTacComponent implements OnInit, AfterViewInit {
  @Input() empId = null;
  @Output() cancelSave = new EventEmitter<any>();
  dataDetailInfo = null;
  listViewsDetail = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  optionsButtonsView = [
    { label: 'Bỏ qua', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu tạm', value: 'Update', class: 'btn-accept' },
    { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
  ]

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          console.log(event)
          this.addProcess()
        });
      }
    }, 300);
  }
  
  ngOnInit(): void {
    this.getEmpProcessPageByEmpId();
    // this.getDetail();
  }
  columnDefs = [];
  gridKey = '';
  listsData = []
  getEmpProcessPageByEmpId() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpProcessPageByEmpId(queryParams).subscribe(repo => {
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
  processId = null;
  editRow(event) {
    this.processId = event.rowData.processId;
    this.getDetail();
  }
  displayFormEditDetail = false;
  canceldataDetailInfo(event) {
    if (event === 'CauHinh') {
      this.getDetail();
    } else {
      this.displayFormEditDetail = false
    }
  }

  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  addProcess() {
    this.processId = null
    this.getDetail();
  }


  activeIndex = 0;
  flowCurrent = 0;
  steps = [];
  getDetail(flow_cur = null) {
    this.FnEvent();
    this.spinner.show();
    this.dataDetailInfo = null;
    this.listViewsDetail = [];
    const query = { empId: this.empId, processId: this.processId, flow_cur: flow_cur }
    this.apiService.getEmpProcessInfo(queryString.stringify(query)).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViewsDetail = cloneDeep(results.data.group_fields || []);
        this.dataDetailInfo = results.data;
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur + 1;
        this.steps = results.data?.flowStatuses?.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        this.displayFormEditDetail = true;
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        if (results.data.submit_st) {
          this.optionsButtonsView = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
          ]
        } else {
          if (results.data.save_st) {
            this.optionsButtonsView = [
              { label: results.data.flow_cur === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_cur === 0 ? 'Cancel' : 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          } else {
            this.optionsButtonsView = [
              { label: results.data.flow_cur === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_cur === 0 ? 'Cancel' : 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }

        }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }


  callBackForm(event) {
    const params = {
      ...this.dataDetailInfo, group_fields: event.data, flow_cur: this.flowCurrent
    }
    this.closeListViewsDetail = cloneDeep(this.listViewsDetail);
    this.listViewsDetail = []
    this.callApiInfo(params, event.type)


    
  
  }

  stepActivated(): void {
    console.log(this.flowCurrent)
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.flowCurrent) {
          console.log(i,i<= this.flowCurrent && i !== 0)
          // console.log(i !== 1)
          stepS[i].className +=  ` p-highlight ${i<= this.activeIndex ? 'active' : 'remove-active'} ${i<= this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  closeListViewsDetail = []
  setDetail(data) {
    const params = {
      ...this.dataDetailInfo, group_fields: data, flow_cur: this.flowCurrent
    };
    this.closeListViewsDetail = cloneDeep(this.listViewsDetail);
    this.listViewsDetail = [];
    this.callApiInfo(params)

  }

  callApiInfo(params, type = 'Update') {
    this.apiService.setEmpProcessInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields || []);
        this.dataDetailInfo = results.data;
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur + 1;
        this.getEmpProcessPageByEmpId();
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        if (results.data.submit_st) {
          this.optionsButtonsView = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
          ]
        } else {
          if (results.data.save_st) {
            this.optionsButtonsView = [
              { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Lưu tạm', value: 'Update', class: 'btn-accept' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          } else {
            this.optionsButtonsView = [
              { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }

        }
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thông tin thành công' });
        if (type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
           this.displayFormEditDetail = false;
           this.getEmpProcessPageByEmpId();
           this.cancelSave.emit()
          }, 200);
        }
      } else {
        this.listViewsDetail = cloneDeep(this.closeListViewsDetail);
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  canceDetail(data) {
    if (data === 'CauHinh') {
      this.getDetail()
    } else if (data === 'BackPage') {
      this.listViewsDetail = [];
      this.getDetail(this.flowCurrent - 2)
    } else {
      this.displayFormEditDetail = false;
    }
  }
  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa quá trình làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({ processId: event.rowData.processId });
        this.apiService.delEmpProcessInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpProcessPageByEmpId();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
}






