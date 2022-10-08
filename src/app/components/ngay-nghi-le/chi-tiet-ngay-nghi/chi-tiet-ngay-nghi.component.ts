import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep, flatten } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as moment from 'moment';
import { CheckHideAction, getDaysOfEndWeek, getDaysOfMonth, getDaysOfSaturDay, getDaysOfSunday } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
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
    { label: 'Hủy', value: 'Cancel', class: CheckHideAction(MENUACTIONROLEAPI.HolidayPage.url, ACTIONS.EDIT) ? 'hidden' : 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ]
  whatDay = [
    { label: 'Ngày thường', value: 5 },
    { label: 'Thứ 7 xen kẽ', value: 6 },
    { label: 'Cuối tuần', value: 3 },
    // {label: 'Ngày lễ', value: 2},
    { label: 'Thứ 7', value: 1 },
    { label: 'Chủ nhật', value: 2 },
  ]
  whatDayName = 0;
  checkAllT7Chan = false;
  checkAllT7Le = false;
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
    this.listDayWeeks = flatten(listDayWeeks)
    this.dsSaturdays = flatten(dsSaturdays)
    this.dsSundays = flatten(dsSundays)
    this.dates = this.dsNgayThuongs[5];
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách ngày nghỉ', routerLink: '/cai-dat/cai-dat-ngay-nghi-le' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  };

  selecteOptionDate(value) {
    console.log(value)
    if (value === 5) {
      this.dates = this.dsNgayThuongs[new Date().getMonth()];
    } else if (value === 3) {
      this.dates = this.listDayWeeks;
    } else if (value === 1 || value === 6) {
      this.dates = this.dsSaturdays;
    } else if (value === 2) {
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
    id: 0,
  }
  titlePage = '';
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.id = this.paramsObject.params.id || 0
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
    if(data === 'CauHinh') {
      this.getHolidayInfo();
    }else {
      if(data) {
        this.whatDayName = parseInt(data);
        console.log(this.whatDayName)
        this.selecteOptionDate(this.whatDayName)
      }else {
        this.router.navigate(['/cai-dat/cai-dat-ngay-nghi-le']);
      }
    }
   
  }
  modelMonth = new Date().getMonth() + 1;
  nextDate() {
    if(this.modelMonth < 12) {
      this.modelMonth = this.modelMonth + 1;
      this.dates = this.dsNgayThuongs[this.modelMonth -1];
    }
   
  }
  prevDate() {
    if(this.modelMonth > 0) {
      this.modelMonth = this.modelMonth - 1;
      this.dates = this.dsNgayThuongs[this.modelMonth-1];
    }
  }

  checkAllDateT7Chan() {
    this.dsSaturdays.forEach(date => {
      const catDate = parseInt(date.value.split('-')[0]);
      if(catDate % 2 === 0) {
        this.selectedDates.push(date.id_date);
        console.log( this.selectedDates)
      }
  })
  this.selectedDates = [...this.selectedDates]
  }

  removeCheckbox() {
    this.selectedDates = [];
    this.checkAllT7Chan =false;
    this.checkAllT7Le =false;
  }

  checkAllDateT7Le() {
    this.dsSaturdays.forEach(date => {
      const catDate = parseInt(date.value.split('-')[0]);
      if(catDate % 2 !== 0) {
        this.selectedDates.push(date.id_date);
      }
  })
  this.selectedDates = [...this.selectedDates]
  }

}

