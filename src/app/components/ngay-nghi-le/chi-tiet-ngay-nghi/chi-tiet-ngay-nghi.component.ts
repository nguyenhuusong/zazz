import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as moment from 'moment';
import { getDaysOfEndWeek, getDaysOfMonth } from 'src/app/common/function-common/common';
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
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  }
  ]
  whatDay = [
    {name: 'Ngày thường', code: 0},
    {name: 'Cuối tuần', code: 1},
    {name: 'Ngày lễ', code: 2},
    {name: 'Thứ 7 xen kẽ', code: 3},
  ]
  whatDayName = 'thuong'
  selectedCities: string[] = [];
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
  listDayWeeks = [];
  dsNgayThuongs = [];
  dates = [];
  ngOnInit(): void {
    this.listDayWeeks = [...getDaysOfEndWeek(2022,6), ...getDaysOfEndWeek(2022,7),...getDaysOfEndWeek(2022,8), ...getDaysOfEndWeek(2022,9)];
    this.dsNgayThuongs = [...getDaysOfMonth(2022,6)];
    this.dates = this.dsNgayThuongs;
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Ngày nghỉ', routerLink: '/cai-dat/cai-dat-ngay-nghi-le' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  };

  selecteOptionDate(event) {
    if(event.value.code === 0) {
      this.dates = this.dsNgayThuongs;
    }else if(event.value.code === 1) {
      this.dates = this.listDayWeeks ;
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
      ...this.detailInfo, group_fields: data
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

