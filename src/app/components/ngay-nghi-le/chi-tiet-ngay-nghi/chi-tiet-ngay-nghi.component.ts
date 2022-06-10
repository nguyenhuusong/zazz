import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep, flatten } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as moment from 'moment';
import { getDaysOfEndWeek, getDaysOfMonth, getDaysOfSaturDay, getDaysOfSunday } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-ngay-nghi',
  templateUrl: './chi-tiet-ngay-nghi.component.html',
  styleUrls: ['./chi-tiet-ngay-nghi.component.scss']
})
export class ChiTietNgayNghiComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ]
  whatDay = [
    { label: 'Ngày thường', value: 0 },
    { label: 'Cuối tuần', value: 1 },
    // {label: 'Ngày lễ', value: 2},
    { label: 'Thứ 7 xen kẽ', value: 3 },
    { label: 'Thứ 7', value: 4 },
    { label: 'Chủ nhật', value: 5 },
  ]
  whatDayName = 0
  selectedDates: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  checkAllday = false;
  listDayWeeks = [];
  dsNgayThuongs = [];
  dsSaturdays = [];
  dsSundays = [];
  dates = [];
  ngOnInit(): void {
    const listDayWeeks = [], dsSaturdays = [], dsSundays = [];
    for (let i = 0; i < 12; i++) {
      listDayWeeks.push(getDaysOfEndWeek(2022, i + 1));
      this.dsNgayThuongs.push(getDaysOfMonth(2022, i + 1))
      dsSaturdays.push(getDaysOfSaturDay(2022, i + 1))
      dsSundays.push(getDaysOfSunday(2022, i + 1))
    }
    console.log(this.dsNgayThuongs)
    this.listDayWeeks = flatten(listDayWeeks)
    this.dsSaturdays = flatten(dsSaturdays)
    this.dsSundays = flatten(dsSundays)
    this.dates = this.dsNgayThuongs[5];
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Ngày nghỉ', routerLink: '/cai-dat/cai-dat-ngay-nghi-le' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  };

  selecteOptionDate(event) {
    if (event.value === 0) {
      this.dates = this.dsNgayThuongs[new Date().getMonth()];
    } else if (event.value === 1) {
      this.dates = this.listDayWeeks;
    } else if (event.value === 3 || event.value === 4) {
      this.dates = this.dsSaturdays;
    } else if (event.value === 5) {
      this.dates = this.dsSundays;
    }
  }

  checkAllDate() {
    if (this.checkAllday) {
      this.selectedDates = this.dates.map(d => d.id_date)
    } else {
      this.selectedDates = [];
    }

  }

  modelEdit = {
    id: "",
  }
  titlePage = '';
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.id = this.paramsObject.params.id || ""
        this.getHolidayInfo();
      });
  };

  getHolidayInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getHolidayInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setHolidayInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data, dates: this.selectedDates
    }
    this.apiService.setHolidayInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le']);
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }

  quaylai(data) {
    this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le']);
  }

}

