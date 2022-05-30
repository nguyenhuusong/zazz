import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
// import { ChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private HomeService: ApiHrmService, private route: ActivatedRoute, private router: Router) { }
  columnDefs = [];
    
  columnDefs1 = [];
  months: any = []
  basicData: any;
  basicData2: any;
  basicOptions: any;
  basicOptions2: any;
  dataDou: any;
  ngOnInit() {
    this.drawChart();
    this.columnDefs = [
      {
       headerName: 'Thời gian',
       cellClass: ['border-right'],
       field: 'date'
      },
      {
       headerName: 'Hoạt động',
       cellClass: ['border-right'],
       field: 'hoat_dong'
      }]
    this.columnDefs1 = [
      {
       headerName: 'Tên khách hàng',
       cellClass: ['border-right'],
       field: 'tenKH'
      },
      {
       headerName: 'Nội Dung cần hỗ trợ',
       cellClass: ['border-right'],
       field: 'noiDung'
      }]
      this.months = [
        {name: 'Tháng 1', code: '1'},
        {name: 'Tháng 2', code: '2'},
        {name: 'Tháng 3', code: '3'},
        {name: 'Tháng 4', code: '4'},
        {name: 'Tháng 5', code: '5'},
        {name: 'Tháng 6', code: '6'},
        {name: 'Tháng 7', code: '7'},
        {name: 'Tháng 8', code: '8'},
        {name: 'Tháng 9', code: '9'},
        {name: 'Tháng 10', code: '10'},
        {name: 'Tháng 11', code: '11'},
        {name: 'Tháng 12', code: '12'},
    ];
      this.basicData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
    };

    this.basicData2 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: '#42A5F5',
              tension: .4
          },
          {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderColor: '#FFA726',
              tension: .4
          }
      ]
  };
  
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#ebedef'
              }
          }
      },
      options: {
          maintainAspectRatio: false,
          responsive: true,

      },
      scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                }
            }
        }
    };
    
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };
  this.dataDou = {
    labels: ['A','B','C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }
    ]
};
  }
  ngOnDestroy() {
  }
  drawChart(){ 
    
 }
  // line chart
 chartOptions = {
  responsive: true
};

chartData = [
  { data: [330, 600, 260, 700], label: 'Nhóm Palace' },
  { data: [120, 455, 100, 340], label: 'Nhóm Garden' },
  { data: [45, 67, 800, 500], label: 'Nhóm Penhouse' },
  { data: [11, 233, 111, 333], label: 'Nhóm Center' },
  { data: [134, 671, 389, 500], label: 'Nhóm Revierside' }
];

chartLabels = ['January', 'February', 'Mars', 'April'];

onChartClick(event) {
  console.log(event);
}
// line chart end
// bar chart
public barChartOptions:any = {
  scaleShowVerticalLines: false,
  responsive: true
};
public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
public barChartType:string = 'bar';
public barChartLegend:boolean = true;

public barChartData:any[] = [
  //{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  {data: [300, 356, 367, 671, 578, 456, 800], label: 'Số lượng khách hàng'}
];

// events
public chartClicked(e:any):void {
  console.log(e);
}

public chartHovered(e:any):void {
  console.log(e);
}

dataLamViecTrongNgay = [
  {date: '09:15', hoat_dong: 'Gửi mail cho khách'},
  {date: '11:15', hoat_dong: 'Gửi SMS cho khách'},
  {date: '13:15', hoat_dong: 'Họp báo cáo thông tin'},
  {date: '14:15', hoat_dong: 'Tạo khách hàng'},
  {date: '16:15', hoat_dong: 'Xuống dự án hỗ trợ khách hàng'},
]

dataHoTroKhachHang = [
  {tenKH: 'Trần Thị Thùy Dương', noiDung: 'Gửi bộ phận htro, hiện nhà tôi bình nóng lạnh không biết vì lý do gì mà bật lên ko được, không có đèn báo sáng và không có nước nóng tại phòng vệ sinh chung. Vậy nhờ bộ phận kỹ thuật lên sửa chữa giúp'},
  {tenKH: 'Đỗ Thị Thanh Nga', noiDung: 'Sửa sàn gỗ bị ọp ẹp.xử lý khe trc cửa nhà vs, sơn lại tường 1 số vị trí.'},
  {tenKH: 'Nguyễn Thị Thanh Hòa', noiDung: '1 số bóng điện không hoạt động Ổ công tắc phòng ngủ nhỏ k khít, sử dụng hơi bị kẹt Đề nghị bql cho người qua kiểm tra và thay thế lúc 13:30 Many thanks.'},
  {tenKH: 'Nguyễn Minh Quang', noiDung: 'Căn 412 đã quá hơn 100 ngày chưa bàn giao. Hiên trạng toàn đồ cũ. Không đúng như hợp đồng. Tôi xin huỷ hợp đồng. Nếu không tôi nhờ truyền thông căn thiệp.'},
  {tenKH: 'Lê Mạnh Cường', noiDung: 'Cửa ban công rất khó kéo. Kính đề nghị bql quan tâm sửa sớm.'},
]


public randomize():void {
  // Only Change 3 values
  let data = [
    Math.round(Math.random() * 100),
    59,
    80,
    (Math.random() * 100),
    56,
    (Math.random() * 100),
    40];
  let clone = JSON.parse(JSON.stringify(this.barChartData));
  clone[0].data = data;
  this.barChartData = clone;
  /**
   * (My guess), for Angular to recognize the change in the dataset
   * it has to change the dataset variable directly,
   * so one way around it, is to clone the data, change it and then
   * assign it;
   */
}
// bar chart end

load() {}

}
