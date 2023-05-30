
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
import queryString from 'query-string';
import { DashboardEmployee } from 'src/app/types/dashboard.type';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-tong-quan-nhan-su',
  templateUrl: './tong-quan-nhan-su.component.html',
  styleUrls: ['./tong-quan-nhan-su.component.scss']
})
export class TongQuanNhanSuComponent implements OnInit {
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

  itemsToolOfGrid = []
  ngOnInit() {

    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Nhân sự' },
      { label: 'Tổng quan nhân sự' },
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

    this.getDashboardEmployee()
  }
  detailDashboardEmployee: DashboardEmployee;
  getDashboardEmployee() {
    this.spinner.show();
    this.apiService.getDashboardEmployee({ months: 0, years: 0 })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          console.log(results.data)
          this.detailDashboardEmployee = results.data;
          this.onInitChart()
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }
  dataChart: any;
  dataChartEmpProcessing: any;
  dataChartEmpPositionType: any;
  dataChartEmpPosition: any;
  dataChartEmpContractType: any;
  optionsHorizontal: any;
  optionsChart: any;
  onInitChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.dataChart = {
      labels: this.detailDashboardEmployee.empWorking.map(d => d.name),
      datasets: [
        {
          label: this.detailDashboardEmployee.empWorking.map(d => d.name),
          data: this.detailDashboardEmployee.empWorking.map(d => d.emp_num),
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

    this.dataChartEmpProcessing = {
      labels: this.detailDashboardEmployee.empProcessing.map(d => d.name),
      datasets: [
        {
          label: this.detailDashboardEmployee.empProcessing.map(d => d.name),
          data: this.detailDashboardEmployee.empProcessing.map(d => d.emp_num),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(60, 179, 113, 0.2)',
            'rgba(255, 156, 48, 0.2)',
            'rgba(255, 156, 251, 0.2)',
            'rgba(106, 90, 205, 0.2)',
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
          ],
          borderWidth: 1
        }
      ]
    };

    this.dataChartEmpPositionType = {
      labels: this.detailDashboardEmployee.empPositionType.map(d => d.name),
      datasets: [
        {
          label: this.detailDashboardEmployee.empPositionType.map(d => d.name),
          data: this.detailDashboardEmployee.empPositionType.map(d => d.emp_num),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(60, 179, 113, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(60, 179, 113)',
          ],
          borderWidth: 1
        }
      ]
    };
    this.dataChartEmpPosition = {
      labels: this.detailDashboardEmployee.empPosition.map(d => d.name),
      datasets: [
        {
          label: this.detailDashboardEmployee.empPosition.map(d => d.name),
          data: this.detailDashboardEmployee.empPosition.map(d => d.emp_num),
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
    this.dataChartEmpContractType = {
      labels: this.detailDashboardEmployee.empContractType.map(d => d.name),
      datasets: [
        {
          label: this.detailDashboardEmployee.empContractType.map(d => d.name),
          data: this.detailDashboardEmployee.empContractType.map(d => d.emp_num),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
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
          }
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
    
    this.optionsHorizontal = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
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
  }

 

}


