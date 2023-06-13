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
import * as moment from 'moment';
import { TimeKeepingDailyComponent } from './time-keeping-daily/time-keeping-daily.component';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-cs-cham-cong-overview',
  templateUrl: './cs-cham-cong-overview.component.html',
  styleUrls: ['./cs-cham-cong-overview.component.scss']
})
export class CsChamCongOverviewComponent implements OnInit {
  @ViewChild('timeKeepingDaily') timeKeepingDaily: TimeKeepingDailyComponent;
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
  monthYear = '';
  filterType = '';
  baseQuery = {
    months: 0, 
    years: 0
  }
  timeKeepingQuery = {
    months: 0, 
    years: 0 , 
    filter_type: null 
  }
  filterTypeOptions = [
    { label: 'Type 1', value: null },
    { label: 'Type 2', value: 1 },
    { label: 'Type 3', value: 2 },
  ]
  ngOnInit() {
    this.getColors();
    let colorRgb = this.hexToRgb('#fff');
    console.log('colorRgb', colorRgb.toString())
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chấm công' },
      { label: 'Tổng quan chấm công' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Import',
        code: 'import',
        icon: 'pi pi-file-excel',
        command: () => {
        },
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.IMPORT),
      },
    ]

    this.getDashboardTimekeeping()
  }
  detailDashboardTimekeeping: DashboardTimekeeping;
  getDashboardTimekeeping() {
    this.spinner.show();
    this.apiService.getDashboardTimekeeping(this.baseQuery)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.detailDashboardTimekeeping = results.data;
          this.onInitChart()
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
  onInitChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.dataChart = {

      labels: this.detailDashboardTimekeeping.leaveReasons.map(d => d.name),
      datasets: [
        {
          label: 'Công việc',
          data: this.detailDashboardTimekeeping.leaveReasons.map(d => d.emp_num),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(60, 179, 113, 0.2)',
            'rgba(255, 156, 48, 0.2)',
            'rgba(255, 156, 251, 0.2)',
            'rgba(106, 90, 205, 0.2)',
            'rgba(255, 99, 71, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(60, 179, 113)',
            'rgb(255, 156, 48)',
            'rgb(255, 156, 251)',
            'rgb(106, 90, 205)',
            'rgb(255, 99, 71)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.dataChartEmpLeaveMonths = {
      labels: this.detailDashboardTimekeeping.agvLeaveMonths.map(d => d.name),
      datasets: [
        {
          label: 'this.detailDashboardTimekeeping.empProcessing.map(d => d.name)',
          data: this.detailDashboardTimekeeping.agvLeaveMonths.map(d => d.num),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(60, 179, 113, 0.2)',
            'rgba(255, 156, 48, 0.2)',
            'rgba(255, 156, 251, 0.2)',
            'rgba(106, 90, 205, 0.2)',
            'rgba(255, 99, 71, 0.2)',
            'rgba(120, 120, 120, 0.2)',
            'rgba(234, 156, 120, 0.2)',
            'rgba(255, 156, 59, 0.2)',
            'rgba(42, 156, 59, 0.2)',
            'rgba(42, 14, 59, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(60, 179, 113)',
            'rgb(255, 156, 48)',
            'rgb(255, 156, 251)',
            'rgb(106, 90, 205)',
            'rgb(255, 99, 71)',
            'rgb(120, 120, 120)',
            'rgb(234, 156, 120)',
            'rgb(255, 156, 59)',
            'rgb(42, 156, 59)',
            'rgb(42, 14, 59)',
          ],
          borderWidth: 1
        }
      ]
    };

    this.optionsChart = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          },
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.optionsChartPie = {
      options: {
        responsive: true,
        indexAxis: 'x',
        plugins: {
          htmlLegend: {
            containerID: 'legend-doughnut',
          },
          legend: {
            display: false,
          },
        },

      }
    }

    this.optionsHorizontal = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          },
          position: 'top',
          maxWidth: 500,
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.chartPie();
  }

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

  onSelectMonth(event) {
    let date = this.queryToDate(this.monthYear);
    this.baseQuery.months = date.months
    this.baseQuery.years = date.years
    
    this.timeKeepingQuery.months = date.months
    this.timeKeepingQuery.years = date.years

    this.getDashboardTimekeeping();
    this.timeKeepingDaily.getTimekeepingDaily();
  }

  changeTypeFilter() {
    this.timeKeepingDaily.getTimekeepingDaily();
  }

  hexToRgb(color) {
    return color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16));
  }

  chartPie() {
    let configs = {
      type: 'pie',
      canvasID: 'doughnut',
      options: {
        responsive: true,
        indexAxis: 'x',
        plugins: {
          htmlLegend: {
            containerID: 'legend-doughnut',
          },
          legend: {
            display: false,
          },
        },

      }
    }
    let labels = this.dataChart.labels
    let bg = []
    for (let i = 0; i < this.dataChart.labels.length; i++) {
      bg.push(this.bgColors[i]);
    };
    let datas = {
      labels: labels,
      datasets: this.dataChart.datasets
    };
    this.drawChart(configs, datas)
  }

  /*
    configs: type, options(htmlLegend), canvasID
    data:
  */
  drawChart(configs, datas) {
    if (configs.canvasID) {
      setTimeout(() => {
        let ctx: any = document.getElementById(configs.canvasID);
        ctx = ctx.getContext('2d');
        let chart = new Chart(ctx, {
          type: configs.type,
          data: datas,
          options: configs.options,
          plugins: [{
            id: 'htmlLegend',
            afterUpdate(chart: any, args, options: any) {
              if (configs.options.plugins.htmlLegend?.containerID) {
                const legendContainer = document.getElementById(configs.options.plugins.htmlLegend.containerID);
                let listContainer: any = legendContainer.querySelector('ul');
                if (!listContainer) {
                  listContainer = document.createElement('ul');
                  listContainer.style.display = 'flex';
                  listContainer.style.flexDirection = 'row';
                  listContainer.style.margin = 0;
                  listContainer.style.padding = 0;
                  legendContainer.appendChild(listContainer);
                }
                const ul = listContainer;

                // Remove old legend items
                while (ul.firstChild) {
                  ul.firstChild.remove();
                }

                const items = chart.options.plugins.legend.labels.generateLabels(chart);
                items.forEach((item: any) => {
                  const li = document.createElement('li');
                  const { type } = chart.config;
                  li.onclick = () => {
                    if (type === 'pie' || type === 'doughnut') {
                      // Pie and doughnut charts only have a single dataset and visibility is per item
                      chart.toggleDataVisibility(item.index);
                    } else {
                      chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    chart.update();
                  };

                  // Color box
                  const boxSpan = document.createElement('span');
                  boxSpan.style.background = item.fillStyle;
                  // Text
                  const textContainer: any = document.createElement('span');
                  textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
                  let numberValue = ''
                  if (type === 'pie' || type === 'doughnut') {
                    if (chart.config.data.datasets.length === 1) {
                      numberValue += ' (' + new Intl.NumberFormat().format(chart.config.data.datasets[0].data[item.index]) + ')';
                    }
                  }
                  const text = document.createTextNode(item.text + numberValue);
                  textContainer.appendChild(text);
                  li.appendChild(boxSpan);
                  li.appendChild(textContainer);
                  ul.appendChild(li);
                });
              }
            }
          }],
        });
        chart.update();

        // chart.destroy();
      }, 500);
    }
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

  queryToDate(date) {
    let months = moment(date).month();
    let years = moment(date).year();
    return {
      months, years
    }
  }

}


