import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
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
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    recordId: null
  };
  gridflexs =[];
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  first = 0;
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
    this.query.recordId = this.recordId;
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

  paginate(event): void {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.getSalaryEmployeePage();
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + e.clientHeight +160;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }
  status = [];
  selectedStatus = null;
  detailpage = null;
  getSalaryEmployeePage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ ...this.query});
    this.apiService.getSalaryEmployeePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList;
        this.detailpage = results.data;
        this.gridKey= results.data.gridKey;
        if (this.query.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.initGrid();
        this.status = results.data.flowStatuses || [];
        if (results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if (results.data.actions) {
          this.initButton();
        }
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.currentRecordStart = results.data.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  menuActions = []
  initButton() {
    this.menuActions = this.detailpage.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this.callActions(item.code);
        }
      }
    });
  }

  onBack() {
    this.router.navigate(['/chinh-sach/tien-luong'])
  }


  UpdateStatus() {
    // this.getSalaryRecordInfo(this.selectedStatus.value);
  }

  callActions(code) {
    this[code]();
  }

  actConfirm() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này ?',
      accept: () => {
        this.apiService.setSalaryEmployeeConfirm({ recordId: this.recordId })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
            this.getSalaryEmployeePage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
  
  actReDo() {
    // /api/v1/salary/SetSalaryEmployeeRedo
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này ?',
      accept: () => {
        this.apiService.setSalaryEmployeeRedo({ recordId: this.recordId })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
            this.getSalaryEmployeePage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  actExport() {
    this.spinner.show();
    const query = {
      recordId: this.recordId
    }
    this.apiService.setSalaryEmployeeExport(query)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        if (results.type === 'application/json') {
          this.spinner.hide();
        } else if (results.type === 'application/octet-stream') {
          var blob = new Blob([results], { type: 'application/msword' });
          FileSaver.saveAs(blob, `Danh sách nhân viên` + ".xlsx");
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      });
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.addCertificate();
    }else {
      this.displayFormEditDetail = false;
      this.getSalaryEmployeePage();
    }
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs || []),
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
      //           label: 'Xem',
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
