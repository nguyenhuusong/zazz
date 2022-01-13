import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {SelectItem } from 'primeng/api';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  moment = moment().utcOffset(0, true);
  constructor(
    // private apiSmart: ApiSmartService,
  ) { }
  revenueTabMenuItems: any = [];
  bestSellingTabMenuItems: any = [];
  timelines = [];
  events: any[];

  store_id = '97c54780-187f-4b99-b2c0-380a0f391366';
  bestSellingTye: number = 1;
  summaryDataModel = {
    sales: { total: "", total_amount: "" },
    returns: { total: "", total_amount: "" }
  }
  bestSellingSelectedDate: SelectItem;
  revenueSelectedDate: SelectItem;
  revenueTye: number = 1;
  revenueChart: any = {
    data: {
      labels: ["0.1", "0.2"],
      datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#FFA726',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    },
    options: []
  };
  bestSellingChart: any = {
    data: {
      labels: ["0.1", "0.2"],
      datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#FFA726',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    },
    options: []
  };
  colors = [
    { backgroundColor: "#0063FD", borderColor: "#F3F9FF", hoverBackgroundColor: "#0063FDcc", hoverBorderColor: "#F3F9FF" },
    { backgroundColor: "#D949D8", borderColor: "#F3F9FF", hoverBackgroundColor: "#D949D8cc", hoverBorderColor: "#F3F9FF" },
    { backgroundColor: "#FF4F9F", borderColor: "#F3F9FF", hoverBackgroundColor: "#FF4F9Fcc", hoverBorderColor: "#F3F9FF" },
    { backgroundColor: "#33a8c7", borderColor: "#F3F9FF", hoverBackgroundColor: "#33a8c7cc", hoverBorderColor: "#F3F9FF" },
    { backgroundColor: "#2ec4b6", borderColor: "#F3F9FF", hoverBackgroundColor: "#2ec4b6cc", hoverBorderColor: "#F3F9FF" },
  ];


  horizontalOptions: any;
  filterDate: SelectItem[];

  ngOnInit(): void {
    this.events = [
      {
        action: "nhập hàng trả lại",
        bgClass: "bg-secondary",
        code: "IT01-TL-2021-000005",
        employeeName: "Phạm Hà",
        icon: "fa fa-reply",
        time: "3 ngày, 2 giờ trước",
        value: 14000,
      },
      {
        action: "nhập hàng trả lại",
        bgClass: "bg-secondary",
        code: "IT01-TL-2021-000005",
        employeeName: "Phạm Hà",
        icon: "fa fa-reply",
        time: "3 ngày, 2 giờ trước",
        value: 14000,
      },
      {
        action: "nhập hàng trả lại",
        bgClass: "bg-secondary",
        code: "IT01-TL-2021-000005",
        employeeName: "Phạm Hà",
        icon: "fa fa-reply",
        time: "3 ngày, 2 giờ trước",
        value: 14000,
      },
      {
        action: "nhập hàng trả lại",
        bgClass: "bg-secondary",
        code: "IT01-TL-2021-000005",
        employeeName: "Phạm Hà",
        icon: "fa fa-reply",
        time: "3 ngày, 2 giờ trước",
        value: 14000,
      }
  ];
    this.revenueTabMenuItems = [
      { 
        label: 'Theo ngày',
        command: (e) => {
          this.revenueTye = 1;
          this.getRevenueChartData();
        }
      },
      { 
        label: 'Theo thứ',
        command: (e) => {
          this.revenueTye = 2;
          this.getRevenueChartData();
        }
      },
      { 
        label: 'Theo giờ',
        command: (e) => {
          this.revenueTye = 3;
          this.getRevenueChartData();
        }
       }
    ];
    this.bestSellingTabMenuItems = [
      { label: 'Theo doanh thu', icon: '', command: (e) => { this.bestSellingTye = 1; this.getBestSellingProductChartData() } },
      { label: 'Theo số lượng', icon: '', command: (e) => { this.bestSellingTye = 2; this.getBestSellingProductChartData() } },
    ];

    this.filterDate = [
      { label: 'Hôm nay', value: { from: this.moment.clone().startOf("day").format(), to: this.moment.clone().utcOffset(0,true).format() } },
      { label: 'Hôm qua', value: { from: this.moment.clone().subtract(-1, "days").startOf("day").format(), to: this.moment.clone().subtract(1, "days").endOf("day").format() } },
      { label: '7 ngày qua', value: { from: this.moment.clone().subtract(7, "days").startOf("day").format(), to: this.moment.clone().format() } },
      { label: 'Tháng này', value: { from: this.moment.clone().startOf('month').format(), to: this.moment.clone().format() } },
      { label: 'Tháng trước', value: { from: this.moment.clone().subtract(1, "month").startOf('month').format(), to: this.moment.clone().subtract(1, "month").endOf('month').format() } }
    ];
    this.revenueSelectedDate = this.filterDate[0];
    this.bestSellingSelectedDate = this.filterDate[0];
    this.GetTimeLineData();
    this.getRevenueChartData();
    this.getBestSellingProductChartData();
    this.getSummaryData();
  }

  GetTimeLineData() {
    // const opts = { params: new HttpParams({ fromString: `storeId=${this.store_id}` }) };
    // this.apiSmart.getTimeLineData(opts.params.toString()).subscribe(rs => {
    //   if (rs.statusCode) {
    //     this.timelines = rs.data;
    //   }

    // });
  }

  getDataToday() {

  }

  getRevenueChartData() {
    // const opts = { params: new HttpParams({ 
    // fromString: `storeId=${this.store_id}&type=${this.revenueTye}&from=${this.revenueSelectedDate.value.from}&to=${this.revenueSelectedDate.value.to}` }) };
    // this.apiSmart.getRevenueChartData(opts.params.toString()).subscribe(rs => {
    //   if (rs.statusCode) {
    //     this.revenueChart.data = rs.data
    //     this.revenueChart.data.datasets.forEach((e, i) => {
    //       e.backgroundColor = this.colors[i].backgroundColor;
    //       e.borderColor = this.colors[i].borderColor;
    //     })
    //     console.log(this.revenueChart);
    //   }
    // });
  }

  getBestSellingProductChartData() {
    // const opts = { params: new HttpParams({ fromString: `storeId=${this.store_id}&type=${this.bestSellingTye}&from=${this.bestSellingSelectedDate.value.from}&to=${this.bestSellingSelectedDate.value.to}` }) };
    // this.apiSmart.getBestSellingProductChartData(opts.params.toString()).subscribe(rs => {
    //   if (rs.statusCode) {
    //     this.bestSellingChart.data = rs.data;
    //     this.bestSellingChart.data.datasets.forEach((e, i) => {
    //       e.backgroundColor = this.colors[i].backgroundColor;
    //       e.borderColor = this.colors[i].borderColor;
    //     })
    //   }
    // });
  }

  getSummaryData() {
    // console.log('fjodsijfd');
    // const opts = { params: new HttpParams({ fromString: `storeId=${this.store_id}` }) };
    // this.apiSmart.getSummaryDashboard(opts.params.toString()).subscribe(rs => {
    //   if (rs.statusCode) {
    //     this.summaryDataModel = rs.data
    //   }
    // });
  }

}
