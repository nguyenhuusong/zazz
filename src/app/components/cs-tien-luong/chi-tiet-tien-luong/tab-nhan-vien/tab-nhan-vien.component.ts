import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tab-nhan-vien',
  templateUrl: './tab-nhan-vien.component.html',
  styleUrls: ['./tab-nhan-vien.component.scss']
})
export class TabNhanVienComponent implements OnInit {
  @Input() recordId = null;
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
  
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_chungchi`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addCertificate()
        });
      }
    }, 300);
  }
  

  ngOnInit(): void {
    this.getSalaryEmployeePage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  addCertificate() {
    this.getAddCertificate();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getAddCertificate() {
    const queryParams = queryString.stringify({ recordId: this.recordId});
    this.listViewsDetail = [];
    this.apiService.addCertificate(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setDetailInfo(data) {
    const formData = new FormData();
    formData.append('trainId', this.trainId ? `${this.trainId}` : '');
    formData.append('empId', `${this.dataDetailInfo.empId}`);
    formData.append('train_type', `${this.dataDetailInfo.train_type}`);
    formData.append('group_fields', `${JSON.stringify(data)}`);
    formData.append('formFile', this.dataDetailInfo.formFile[0]);
    this.apiService.setTrainFile(formData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getSalaryEmployeePage();
        this.FnEvent()
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getSalaryEmployeePage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ recordId: this.recordId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalaryEmployeePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.addCertificate();
    }else {
      this.displayFormEditDetail = false;
      this.getSalaryEmployeePage();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      // {
      //   headerComponentParams: {
      //     template:
      //     `<button  class="btn-button" id="${this.gridKey}_chungchi"> <span class="pi pi-plus action-grid-add" ></span></button>`,
      //   },
      //   field: 'gridflexdetails1',
      //   cellClass: ['border-right', 'no-auto'],
      //   pinned: 'right',
      //   width: 70,
      //   cellRenderer: 'buttonAgGridComponent',
      //   cellRendererParams: params => {
      //     return {
      //       buttons: [
      //         {
      //           onClick: this.editRow.bind(this),
      //           label: 'Xem chi tiết',
      //           icon: 'fa fa-edit editing',
      //           key: 'view-job-detail',
      //           class: 'btn-primary mr5',
      //         },

      //         {
      //           onClick: this.delRow.bind(this),
      //           label: 'Xóa',
      //           icon: 'pi pi-trash',
      //           key: 'delete-qua-trinh-hop-dong',
      //           class: 'btn-danger',
      //         },
      //       ]
      //     };
      //   },
      // }
    ];
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  trainId = null;
  editRow({rowData}) {
    this.trainId = rowData.trainId
    this.getTrainFile();
  }

  getTrainFile() {
    this.spinner.show();
    const queryParams = queryString.stringify({ trainId: this.trainId });
    this.listViewsDetail = [];
    this.apiService.getTrainFile(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      if (result.status === 'success') {
        this.listViewsDetail = cloneDeep(result.data.group_fields);
        this.dataDetailInfo = result.data;
        this.displayFormEditDetail = true;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({trainId: event.rowData.trainId});
        this.apiService.delTrainFile(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getSalaryEmployeePage();
            this.FnEvent()
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}
