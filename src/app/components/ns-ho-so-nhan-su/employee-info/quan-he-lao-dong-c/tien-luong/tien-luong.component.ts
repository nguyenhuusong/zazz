

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tien-luong',
  templateUrl: './tien-luong.component.html',
  styleUrls: ['./tien-luong.component.scss']
})
export class TienLuongComponent implements OnInit, AfterViewInit {
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
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addTienLuong()
        });
      }
    }, 300);
  }

  callbackForm() {
    this.getSalaryInfoPageByEmpId();
    this.displayFormEditDetail = false;
  }

  ngOnInit(): void {
    this.getSalaryInfoPageByEmpId();
  }
  columnDefs = [];
  gridKey = '';
  listsData = []
  getSalaryInfoPageByEmpId() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalaryInfoPageByEmpId(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs)
        this.FnEvent();
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
  salaryInfoId = null;
  editRow({ rowData }) {
    this.salaryInfoId = rowData.salaryInfoId;
    this.displayFormEditDetail = true;
    // this.getDetail();
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  displayFormEditDetail = false;
  canceldataDetailInfo(event) {
    if (event === 'CauHinh') {
      this.getDetail();
    } else {
      this.displayFormEditDetail = false;
      this.getSalaryInfoPageByEmpId();
    }
  }

  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  addTienLuong() {
    this.salaryInfoId = null;
    this.displayFormEditDetail = true;
    // this.getDetail();
  }

  activeIndex = 0;
  steps = [];
  getDetail(flow_st = null) {
    this.FnEvent();
    this.spinner.show();
    this.dataDetailInfo = null;
    this.listViewsDetail = [];
    const query = { empId: this.empId, salaryInfoId: this.salaryInfoId, flow_st: flow_st }
    this.apiService.getSalaryInfoNew(queryString.stringify(query))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViewsDetail = cloneDeep(results.data.group_fields || []);
        this.dataDetailInfo = results.data;
        this.activeIndex = results.data.flow_st;
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
        // if (results.data.submit_st) {
        //   this.optionsButtonsView = [
        //     { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //     { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
        //   ]
        // } else {
        //   if (results.data.save_st) {
        //     this.optionsButtonsView = [
        //       { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel' : 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   } else {
        //     this.optionsButtonsView = [
        //       { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel' : 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   }

        // }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  cloneListViewsDetail = [];
  callBackForm(event) {

    this.displayFormEditDetail = false;
    this.getSalaryInfoPageByEmpId();
    this.cancelSave.emit()
    // const params = {
    //   ...this.dataDetailInfo, group_fields: event.data, flow_st: this.activeIndex
    // }
    // // this.cloneListViewsDetail = cloneDeep(this.listViewsDetail);
    // // this.listViewsDetail = []
    // this.callApiInfo(params)
    // if (event.type === 'Submit' || event.type === 'SaveNhap') {
    //   setTimeout(() => {
    //    this.displayFormEditDetail = false;
    //    this.getSalaryInfoPageByEmpId();
    //    this.cancelSave.emit()
    //   }, 200);
    // }
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.activeIndex) {
          stepS[i].className += ' active';
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  setDetail(data) {
    const params = {
      ...this.dataDetailInfo, group_fields: data, flow_st: this.activeIndex + 1
    };
    this.listViewsDetail = [];
    this.callApiInfo(params)

  }

  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setSalaryInfoNew(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thành công' });
        this.displayFormEditDetail = false;
        this.spinner.hide();
        this.getSalaryInfoPageByEmpId();
      } else {
        this.spinner.hide();
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
      this.getDetail(this.activeIndex - 1)
    } else {
      this.displayFormEditDetail = false;
    }
  }
  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({ salaryInfoId: event.rowData.salaryInfoId });
        this.apiService.delSalaryInfoNew(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getSalaryInfoPageByEmpId();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
}






