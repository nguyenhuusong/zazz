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
  selector: 'app-chi-tiet-cs-loi-cham-cong',
  templateUrl: './chi-tiet-cs-loi-cham-cong.component.html',
  styleUrls: ['./chi-tiet-cs-loi-cham-cong.component.scss']
})
export class ChiTietCsLoiChamCongComponent implements OnInit, OnDestroy {
  @Input() queryDetail: any = {};
  @Output() callback = new EventEmitter<any>();
  items: MenuItem[] = [];
  heightGrid = 300;
  query = {
    recordId: '',
    empId: '',
    work_date: '',
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
    this.query = { ...this.query, ...this.queryDetail}
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chấm công' },
      { label: 'Lỗi chấm công', routerLink: '/chinh-sach/loi-cham-cong' },
      { label: 'Chi tiết lỗi chấm công' },
    ];
    this.getTimeSheetPage();
   
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

  getTimeSheetPage() {
    this.columnDefs = []
    // this.spinner.show();
    const params: any = { ...this.query };
    const queryParams = queryString.stringify(params);
      this.apiService.getTimeSheetPage(queryParams)
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

  cauhinh() {

  }

  first = 0;
  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getTimeSheetPage();
  }

}

