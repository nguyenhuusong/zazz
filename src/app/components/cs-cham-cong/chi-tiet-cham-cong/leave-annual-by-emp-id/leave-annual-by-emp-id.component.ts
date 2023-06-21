import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-leave-annual-by-emp-id',
  templateUrl: './leave-annual-by-emp-id.component.html',
  styleUrls: ['./leave-annual-by-emp-id.component.scss']
})
export class LeaveAnnualByEmpIdComponent implements OnInit, OnDestroy {
  @Input() empId: string = '';
  @Output() callback = new EventEmitter<any>();
  items: MenuItem[] = [];
  heightGrid = 300;
  query = {
    empId: '',
    filter: '',
    offSet: 0,
    pageSize: 15
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    
    private router: Router
  ) { }

  private readonly unsubscribe$: Subject<void> = new Subject();
  public agGridFn = AgGridFn;

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.heightGrid = window.innerHeight - 210;
    this.query.empId = this.empId;
    this.getAnnualLeavePageByEmpId();
   
  }

  cols = [];
  listsData = [];
  gridKey = [];
  columnDefs = [];
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  getAnnualLeavePageByEmpId() {
    this.columnDefs = []
    this.spinner.show();
    const params: any = { ...this.query };
    const queryParams = queryString.stringify(params);
      this.apiService.getAnnualLeavePageByEmpId(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList.data;
          this.gridKey = results.data.dataList.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
          }
          this.initGrid();
          this.countRecord.totalRecord = results.data.dataList.recordsTotal;
          this.countRecord.totalRecord = results.data.dataList.recordsTotal;
          this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
          if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
            this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
          } else {
            this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
            setTimeout(() => {
              const noData = document.querySelector('.ag-overlay-no-rows-center');
              if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
            }, 100);
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
    ]
  }

  quaylai(data) {
    this.callback.emit()
  }
  displaySetting = false;
  cauhinh() {
    this.displaySetting = true;
  }

  first = 0;
  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getAnnualLeavePageByEmpId();
  }

}

