import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { Subject, takeUntil } from 'rxjs';
import { DataHeaderDate } from './datas';
import * as moment from 'moment';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
const MAX_SIZE = 100000000;
@Component({
  selector: 'app-quan-ly-ngay-nghi',
  templateUrl: './quan-ly-ngay-nghi.component.html',
  styleUrls: ['./quan-ly-ngay-nghi.component.scss']
})
export class QuanLyNgayNghiComponent implements OnInit, AfterViewChecked, OnDestroy {
  dataRouter: any;
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router) {
    this.dataRouter = this.route.data['_value'];
  }

  query = {
    year: moment().year()
  }
  arraylengths = [];
  arrayYear = []
  listDay = [
    { id: 1, value: 'Sa', title: 'Chủ nhật' },
    { id: 2, value: 'Su', title: 'Thứ Hai' },
    { id: 3, value: 'M', title: 'Thứ ba' },
    { id: 4, value: 'Tu', title: 'Thứ Tư' },
    { id: 5, value: 'W', title: 'Thứ Năm' },
    { id: 6, value: 'Th', title: 'Thứ Sáu' },
    { id: 7, value: 'F', title: 'Thứ bảy' },
  ]
  listLich = [
    {label: 'Lịch dương', value: 1},
    {label: 'Lịch âm', value: 2},
  ]
  headerDate = DataHeaderDate
  pagingComponent = {
    total: 0
  }
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  detailCellRendererParams;
  gridflexs: any;

  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loadjs = 0;
  heightGrid = 0;

  itemsBreadcrumb = []

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight  + 45;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    // this.query = {
    //   filter: '',
    //   project_cd: '',
    //   prodId: null,
    //   gridWidth	: 0,
    //   offSet: 0,
    //   pageSize: 15
    // }
    // this.load();
  }
  listHolidays = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getHolidayPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listHolidays = results.data.months;
        this.listHolidays.forEach(d => {
          const arrdate = []
          d.holidays.forEach(element => {
            if (element.day_dt && element.day_dt.split('/')[0] === '01') {
              d.start = element.column;
            }
            if (element.day_dt) {
              arrdate.push(element)
            }
          });
          d.end = arrdate[arrdate.length - 1].column;
          this.spinner.hide();
        })
      });
  }

  fnRenderTextMont(month) {
    switch (month) {
      case 1:
        return '<span class="text-nowrap" style="font-weight: 500;">JAN</span'
        break;
      case 2:
        return '<span class="text-nowrap" style="font-weight: 500;">FEB</span'
        break;
      case 3:
        return '<span class="text-nowrap" style="font-weight: 500;">MAR</span'
        break;
      case 4:
        return '<span class="text-nowrap" style="font-weight: 500;">APR</span'
        break;
      case 5:
        return '<span class="text-nowrap" style="font-weight: 500;">MAY</span'
        break;
      case 6:
        return '<span class="text-nowrap" style="font-weight: 500;">JUN</span'
        break;
      case 7:
        return '<span class="text-nowrap" style="font-weight: 500;">JUL</span'
        break;
      case 8:
        return '<span class="text-nowrap" style="font-weight: 500;">AUG</span'
        break;
      case 9:
        return '<span class="text-nowrap" style="font-weight: 500;">SEP</span'
        break;
      case 10:
        return '<span class="text-nowrap" style="font-weight: 500;">OCT</span'
        break;
      case 11:
        return '<span class="text-nowrap" style="font-weight: 500;">NOV</span'
        break;
      default:
        return '<span class="text-nowrap" style="font-weight: 500;">DEC</span'
      // code block
    }
  }

  customers
  rows;

  next() {
    this.query.year = this.query.year + 1 <= this.arrayYear[this.arrayYear.length - 1].value ? this.query.year + 1 : this.arrayYear[this.arrayYear.length - 1].value;
    this.load()
  }

  prev() {
    this.query.year = this.query.year - 1 > this.arrayYear[0].value ? this.query.year - 1 : this.arrayYear[0].value;
    this.load()
  }

  reset() {
    this.query.year = moment().year();
    this.load()
  }

  isLastPage(): boolean {
    return this.query.year === this.arrayYear[this.arrayYear.length - 1].value ? true : false;
  }

  isFirstPage(): boolean {
    return this.query.year === this.arrayYear[0].value ? true : false;
  }

  modelAddHoliday = {
    day_dt: '',
    holi_des: '',
    save_config: true,
    calendar_type: 1,
    holi_is: false
  }

  displayAddHoliday = false;

  confirm(event: Event, index, day_dt, holi_is, holi_des) {
    this.displayAddHoliday = true;
    this.modelAddHoliday = {
      day_dt: day_dt,
      holi_des: holi_des,
      save_config: true,
      calendar_type: 1,
      holi_is: holi_is
    }
  }

  updateHoliday() {
    this.spinner.show();
    let params = { ...this.modelAddHoliday };
    delete params.holi_is
    this.apiService.setHolidayAdd(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thành công' });
        this.displayAddHoliday = false;
        this.load();
        this.spinner.hide();
      }else {
        this.spinner.hide();
      }
    })
  }

  AddDayToYear() {
    this.confirmationService.confirm({
      message: `Bạn muốn tạo ngày nghỉ trong năm ${this.query.year}`,
      accept: () => {
        let params = {
          year: this.query.year
        };
        this.spinner.show();
        this.apiService.setHolidayCreate(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Tạo ngày nghỉ thành công' });
            this.load();
            this.spinner.hide();
          }else {
            this.spinner.hide();
          }
        })
      }
    });
  }

  FnHuy() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        let params = {
          day_dt: this.modelAddHoliday.day_dt,
          save_config: this.modelAddHoliday.save_config
        };
        this.spinner.show();
        const queryParams = queryString.stringify(params);
        this.apiService.delHoliday(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Hủy ngày nghỉ thành công' });
            this.displayAddHoliday = false;
            this.load();
            this.spinner.hide();
          }
        })
      }
    });
  }


  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
    ]
    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.Owns);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.Owns.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }


  find() {
    this.load();
  }

  ngOnInit() {
    this.itemsBreadcrumb = [
      { label: 'Trang chủ' },
      { label: 'Danh sách sản phẩm đầu tư', routerLink: '/quan-ly-dau-tu/san-pham-dau-tu' },
      { label: this.dataRouter.title },
    ];
    for (let i = 0; i < 37; i++) {
      this.arraylengths.push(i + 1);
    }
    for (let i = 0; i < 15; i++) {
      this.arrayYear.push({
        label: 2018 + i,
        value: 2018 + i
      });
    }
    this.load()
  }

  paramsObject;
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



}









