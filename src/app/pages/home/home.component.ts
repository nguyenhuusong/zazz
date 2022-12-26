import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Chart } from 'chart.js';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import * as queryString from 'querystring';
// import { ChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(
    private HomeService: ApiHrmService, 
    private route: ActivatedRoute, 
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private router: Router) { }
  columnDefs = [];
    
  columnDefs1 = [];
  months: any = []
  years: any = [];
  basicData: any;
  basicData2: any;
  basicOptions: any;
  basicOptions2: any;
  dataDou: any;

  organs: any = []
  
  // nsMoi: nhan su moi, 
  dashboardData: any = null;
  selectedMonth: any = {name: 'Tháng ' + (moment().month() + 1), code: (moment().month() + 1)}
  selectedYear: any = {
    name: 2022,
    code: 2022
  }
  queryDashboard = {
    orgid: "",
    months: (moment().month() + 1),
    years: 2022
  }
  currentYear = moment().year()
  bg = [
    '#4591FE',
    '#F0D042',
    '#f68c1f',
    '#FFA384',
    '#36eb44',
    '#beeb36',
    '#eb3679',
    '#eb36d5',
    '#7c36eb',
    '#36daeb',
    '#36ebb9',
    '#36eb6e',
  ]
  ngOnInit() {
    this.getDashboardInfo();
    this.load();
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
        {name: 'Tháng 1', code: 1},
        {name: 'Tháng 2', code: 2},
        {name: 'Tháng 3', code: 3},
        {name: 'Tháng 4', code: 4},
        {name: 'Tháng 5', code: 5},
        {name: 'Tháng 6', code: 6},
        {name: 'Tháng 7', code: 7},
        {name: 'Tháng 8', code: 8},
        {name: 'Tháng 9', code: 9},
        {name: 'Tháng 10', code: 10},
        {name: 'Tháng 11', code: 11},
        {name: 'Tháng 12', code: 12},
    ];
    
    this.getYears();
    // this.getAgencyOrganizeMap();
  }
  ngOnDestroy() {
  }
  // line chart
 chartOptions = {
  responsive: true
};

  theOrginSelected: any = {}
  getOriginLabelByid() {
    this.theOrginSelected = this.organs.filter( d => d.value === this.queryDashboard.orgid)
  }

onChartClick(event) {
  console.log(event,this.queryDashboard.orgid);
}
// line chart end
// bar chart
public barChartOptions:any = {
  scaleShowVerticalLines: false,
  responsive: true
};

  getYears() {
    let yearsTem = []
    for( let i = 2000; i <= this.currentYear; i ++ ){
      yearsTem.push({name: i, code: i})
    }
    this.years = yearsTem
  }
chartSlNhanSu() {
  let configs = {
    type: 'bar',
    canvasID: 'so-luong-nhan-su',
      options: {
        responsive: true,
          indexAxis: 'x',
        plugins: {
          // htmlLegend: {
          //   containerID: 'legend-so-luong-nhan-su',
          // },
          legend: {
            display: false,
          },
        },

    }
  }
  let labels = this.dashboardData.nhansuthang.map( month => {
    return month.months
  })
  let value = this.dashboardData.nhansuthang.map( tongnv => {
    return tongnv.tongnv
  })
  
  let datas = {
    labels: labels,
      datasets: [{
        label: 'My First Dataset',
        data: value,
        backgroundColor: [
          '#f68c1f',
        ],
        borderWidth: 1,
        cornerRadius: 20,
        barThickness: 40,
        borderRadius: 4,
        borderSkipped: false,
      }]

    
  };
  this.drawChart(configs, datas)
}

chartBDNhanSu() {
  let configs = {
    type: 'line',
    canvasID: 'bien-dong-nhan-su',
      options: {
        responsive: true,
          // indexAxis: 'x',
        plugins: {
          htmlLegend: {
            containerID: 'legend-bien-dong-nhan-su',
          },
          legend: {
            display: false,
          },
        },

    }
  }

  let labelsNsIn = this.dashboardData.nhansu_in.map( month => {
    return month.months
  })
  let valueNsIn = this.dashboardData.nhansu_in.map( tongnv => {
    return tongnv.tongnv
  })
  
  let labelsNsOut = this.dashboardData.nhansu_out.map( month => {
    return month.months
  })
  let valueNsOut = this.dashboardData.nhansu_out.map( tongnv => {
    return tongnv.tongnv
  })
  
  let datas = {
    labels: labelsNsIn,
      datasets: [
        {
        label: 'Tiếp nhận',
        data: valueNsIn,
        backgroundColor: [
          '#0a58ca',
        ],
        borderWidth: 1,
        cornerRadius: 20,
        barThickness: 40,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Nghỉ việc',
        data: valueNsOut,
        backgroundColor: [
          '#DA100B',
        ],
        borderWidth: 1,
        cornerRadius: 20,
        barThickness: 40,
        borderRadius: 4,
        borderSkipped: false,
      },
    ]

    
  };
  this.drawChart(configs, datas)
}

  charDou() {
    let configs = {
      type: 'doughnut',
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
    let labels = []
    let bg = []
    for(let i = 0; i < this.dashboardData.nhansu_hd.length; i++){
      labels.push( this.dashboardData.nhansu_hd[i].name );
      bg.push(this.bg[i]);
    };
    let value = this.dashboardData.nhansu_hd.map( tongnv => {
      return tongnv.tongnv
    })
    let datas = {
      labels: labels,
        datasets: [{
          label: '',
          data: value,
          backgroundColor: bg,
          borderWidth: 1,
          cornerRadius: 20,
          barThickness: 40,
          borderRadius: 4,
          borderSkipped: false,
        }]

      
    };
    this.drawChart(configs, datas)
  }
  charDou2() {
    let configs = {
      type: 'doughnut',
      canvasID: 'doughnut-2',
        options: {
          responsive: true,
            indexAxis: 'x',
          plugins: {
            htmlLegend: {
              containerID: 'legend-doughnut-2',
            },
            legend: {
              display: false,
            },
          },

      }
    }
    let labels = []
    let bg = []
    for(let i = 0; i < this.dashboardData.nhansu_sex.length; i++){
      labels.push( this.dashboardData.nhansu_sex[i].name );
      bg.push(this.bg[i]);
    };
    let value = this.dashboardData.nhansu_sex.map( tongnv => {
      return tongnv.tongnv
    })
    let datas = {
      labels: labels,
        datasets: [{
          label: '',
          data: value,
          backgroundColor: bg,
          borderWidth: 1,
          cornerRadius: 20,
          barThickness: 40,
          borderRadius: 4,
          borderSkipped: false,
        }]

      
    };
    this.drawChart(configs, datas)
  }

  load() {}

  /*
    configs: type, options(htmlLegend), canvasID
    data:
  */
  drawChart(configs, datas ) {
    if(configs.canvasID) {
      setTimeout(() => {
      let ctx:any = document.getElementById(configs.canvasID);
      ctx = ctx.getContext('2d');
      let chart = new Chart(ctx, {
        type: configs.type,
        data: datas,
        options: configs.options,
        plugins: [{
          id: 'htmlLegend',
          afterUpdate(chart: any, args, options:any) {
            if(configs.options.plugins.htmlLegend?.containerID){
              const legendContainer = document.getElementById(configs.options.plugins.htmlLegend.containerID);
              let listContainer:any = legendContainer.querySelector('ul');
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
              items.forEach((item:any) => {
                const li = document.createElement('li');
                const {type} = chart.config;
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
                const textContainer:any = document.createElement('span');
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
                let numberValue = ''
                if (type === 'pie' || type === 'doughnut') {
                  if(chart.config.data.datasets.length === 1){
                    numberValue += ' (' + new Intl.NumberFormat().format(chart.config.data.datasets[0].data[item.index]) + ')';
                  }
                }
                const text = document.createTextNode(item.text +  numberValue );
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


  listAgencyMap: TreeNode[];
  selectedNode
  detailOrganizeMap = null;
  orgId = ''
  isHrDiagram = false;

  hrDiagram() {
    this.spinner.show();
    this.selectedNode = null;
    this.listAgencyMap = []
    this.isHrDiagram = true;
    // this.getAgencyOrganizeMap(true);
  }
  getAgencyOrganizeMap(type = false) {
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          this.detailOrganizeMap = this.selectedNode
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          this.queryDashboard.orgid = this.selectedNode.orgId;
          this.getOriginLabelByid();
          // this.query.org_level = this.selectedNode.org_level;
          this.load();
        } else {
          // this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          this.queryDashboard.orgid = this.selectedNode.orgId;
          this.getOriginLabelByid();
          // this.parseObjectProperties(this.listAgencyMap, this.selectedNode.organizeId);
          this.detailOrganizeMap = this.selectedNode
          if (type) {
            this.isHrDiagram = true;
          }
          this.load();
        }
        this.getDashboardInfo();
      }
    })
  }

  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    this.isHrDiagram = false;
    this.queryDashboard.orgid = this.detailOrganizeMap.orgId;
    localStorage.setItem("organize", JSON.stringify(this.detailOrganizeMap))
    this.getDashboardInfo()
  }
  getDashboardInfo() {
    
    this.getOriginLabelByid();
    this.dashboardData = null;
    this.apiService.getDashboardInfo(this.queryDashboard)
    .pipe(
      finalize(() => this.spinner.hide())
    )
    .subscribe( results => {
      if (results.status === 'success') {
        this.dashboardData = results.data;
        this.chartSlNhanSu();
        this.chartBDNhanSu();
        this.charDou();
        this.charDou2();
      }
    })
  }

  // select month

  changeMonths(e) {
    this.queryDashboard.months = e.value.code;
    this.spinner.show();
    this.getDashboardInfo()
  }
// select year
  changeYears(e) {
    this.queryDashboard.years = e.value.code;
    this.spinner.show();
    this.getDashboardInfo()
  }

}
