import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-cs-cham-cong-overview',
  templateUrl: './cs-cham-cong-overview.component.html',
  styleUrls: ['./cs-cham-cong-overview.component.scss']
})
export class CsChamCongOverviewComponent implements OnInit {

  items = [];
  dataSeleted = 1;
  dataOptions = [
    { label: 'Hôm nay', value: 1}
  ]
  labelMonths = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  dataOrigns = [
    'Ban hợp tác quốc tế',
    'Ban lãnh đạo',
    'Ban quản trị rủi ro',
    'Khối công nghệ',
    'Khối kinh doanh',
    'Khối nội chính',
    'Khối tài chính - kế toán'
  ]
  labelLoaiNghi = [
    'Nghỉ phép',
    'Nghỉ thai sản',
    'Nghỉ con kết hôn',
    'Nghỉ kết hôn'
  ];
  bg = [
    '#4591FE',
    '#F0D042',
    '#FF7C59',
    '#DA100B',
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
  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách chấm công' },
      { label: 'Tổng quan' },
    ];
    this.nghiTheoThoiGian();
    this.nghiTheoPhongBan();
    this.charDou();
  }

  nghiTheoThoiGian() {
    let configs = {
      type: 'line',
      canvasID: 'nghiTheoThoiGian',
        options: {
          responsive: true,
            // indexAxis: 'x',
          plugins: {
            // htmlLegend: {
            //   containerID: 'legend-nghiTheoThoiGian',
            // },
            legend: {
              display: false,
            },
          },
          showLine: true
      }
    }

    let datas = {
        labels: this.labelMonths,
        datasets: [
          {
          label: '',
          data: [10, 20, 40, 30, 10, 100, 100, 20, 10, 40, 50, 60],
          backgroundColor: [
            '#1F8B24',
          ],
        },
      ]
  
      
    };
    this.drawChart(configs, datas)
  }

  nghiTheoPhongBan() {
    let configs = {
      type: 'bar',
      canvasID: 'nghiTheoPhongBan',
        options: {
          responsive: true,
            // indexAxis: 'x',
          plugins: {
            // htmlLegend: {
            //   containerID: 'legend-nghiTheoThoiGian',
            // },
            legend: {
              display: false,
            },
          },
          showLine: true
      }
    }

    let datas = {
        labels: this.dataOrigns,
        datasets: [
          {
          label: '',
          data: [10, 20, 40, 30, 10, 100, 100, 20, 10, 40, 50, 60],
          backgroundColor: [
            '#1F8B24',
          ],
        },
      ]
  
      
    };
    this.drawChart(configs, datas)
  }

  charDou() {
    let configs = {
      type: 'doughnut',
      canvasID: 'loaiNghi',
        options: {
          responsive: true,
            indexAxis: 'x',
          plugins: {
            htmlLegend: {
              containerID: 'legend-loaiNghi',
            },
            legend: {
              display: false,
            },
          },
          cutout: 100
      }
    }
    let labels = []
    let bg = []
    for(let i = 0; i < this.labelLoaiNghi.length; i++){
      bg.push(this.bg[i]);
    };
    let value = [10, 40, 60, 30]
    let datas = {
      labels: this.labelLoaiNghi,
      datasets: [{
        label: '',
        data: value,
        backgroundColor: bg,
        borderWidth: 1,
        cornerRadius: 10,
        barThickness: 20,
        borderRadius: 4,
        borderSkipped: false,
      }]
    };
    this.drawChart(configs, datas)
  }


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

}