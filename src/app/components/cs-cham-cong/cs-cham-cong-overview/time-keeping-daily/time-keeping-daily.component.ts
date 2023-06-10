
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
import queryString from 'query-string';
import { DashboardEmployee, DashboardTimekeeping } from 'src/app/types/dashboard.type';
import { Chart } from 'chart.js';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-time-keeping-daily',
  templateUrl: './time-keeping-daily.component.html',
  styleUrls: ['./time-keeping-daily.component.scss']
})
export class TimeKeepingDailyComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  items = []
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {

  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  frameworkComponents;
  public agGridFn = AgGridFn;
  cols: any[];
  query: any = {
    filter: '',
    offSet: 0,
    pageSize: 20,
  }
  perMale = 0;
  perFeMale = 0;
  itemsToolOfGrid = [];
  bgColors = [];
  ngOnInit() {
    this.getColors();
    let colorRgb = this.hexToRgb('#fff');
    this.getTimekeepingDaily()
  }
  detailDashboardTimekeepingDailyDaily: any = null;
  getTimekeepingDaily() {
    this.spinner.show();
    this.apiService.getTimekeepingDaily({ months: 0, years: 0 })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.detailDashboardTimekeepingDailyDaily = results.data;
          this.spinner.hide();
          if (results.data.emp_male && results.data.emp_total) {
            this.perMale = this.percenOf(results.data.emp_male, results.data.emp_total)
          }
          if (results.data.emp_female && results.data.emp_total) {
            this.perFeMale = this.percenOf(results.data.emp_female, results.data.emp_total)
          }
        },
        error => {
          this.spinner.hide();
        });
  }



  dataChart: any;
  dataChartEmpLeaveMonths: any;
  dataChartEmpPositionType: any;
  dataChartEmpPosition: any;
  dataChartEmpContractType: any;
  optionsHorizontal: any;
  optionsChart: any;
  optionsChartPie: any;

  percenOf(value, totalVlue) {
    return Math.round((value / totalVlue) * 100);
  }

  getColors() {
    this.bgColors = [
      '#00FF7F', '#FFD700', '#FF4500', '#8B0000', '#4B0082', '#C71585', '#008080', '#BDB76B',
      '#FF6347', '#B22222', '#663399', '#DB7093', '#800000', '#191970', '#00CED1', '#008B8B',
      '#F0E68C', '#483D8B', '#FF1493', '#000000', '#FFE4E1', '#A0522D', '#00008B', '#48D1CC',
      '#20B2AA', '#EEE8AA', '#FF7F50', '#FF0000', '#6A5ACD', '#FF69B4', '#2F4F4F', '#FAF0E6',
      '#8B4513', '#0000CD', '#40E0D0', '#8FBC8F', '#FFDAB9', '#FF8C00', '#7B68EE', '#FFB6C1',
      '#708090', '#FFFFFF', '#D2691E', '#CD853F', '#B8860B', '#DAA520', '#F4A460', '#BC8F8F',
      '#0000FF', '#4169E1', '#1E90FF', '#4682B4', '#5F9EA0', '#7FFFD4', '#66CDAA', '#556B2F',
      '#6B8E23', '#9ACD32', '#006400', '#008000', '#2E8B57', '#ADFF2F', '#FFFF00', '#FFFFE0',
      '#DC143C', '#CD5C5C', '#F08080', '#9370DB', '#800080', '#FF00FF', '#E6E6FA', '#D8BFD8'
    ]
  }

  hexToRgb(color) {
    return color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16));
  }


  navigateWithState(item: any) {
    const linkRouter = MENUACTIONROLEAPI[item.apiName];
    if (linkRouter) {
      const state = item.apiParam ? JSON.parse('{"' + item.apiParam.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => { return key === "" ? value : decodeURIComponent(value) }) : null
      this.router.navigate([`${linkRouter.url}`], { queryParams: { ...state } });
    }
  }

  getDetailEmployye(item: any) {
    this.router.navigate([`nhan-su/ho-so-nhan-su`], { queryParams: { filter: item.fullname } });
  }

}


