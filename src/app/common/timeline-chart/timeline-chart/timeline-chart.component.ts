
import { Component, Input } from '@angular/core';
import queryString from 'query-string';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent  {
  @Input() empId = '';
  constructor(
    private apiService: ApiHrmService) {
    }
  public timelineChartData:any =  {
    chartType: 'Timeline',
    dataTable: 
    [
      ['Nome', 'De', 'Até', {type: 'string', role: 'tooltip', p: {html: true}}],
      [ 'Nhân viên', new Date(2019, 9, 30), new Date(2020, 2, 4), '<div>test</div>' ],
      [ 'Chuyên viên',      new Date(2020, 2, 4),  new Date(2022, 2, 4), '<div>test</div>' ],
      [ 'Trưởng nhóm',  new Date(2022, 2, 4),  new Date(), '<div>test</div>' ]
    ],
    options: {
    //focusTarget: 'category',
    animation: {
      startup: true,
      easing: 'out',
      duration: 500,
    },
    tooltip: {
      isHtml: true
    },
    height: '250',
    interpolateNulls: true,
    chartArea: {
      width: '90%',
      height: '79%',
    },
    vAxes: {
      0: {
        titlePosition: 'none',
        textStyle: {
          color: '#febd02',
          bold: true,
          fontSize: 13,
        },
        format: '#',
        gridlines: {
          color: '#eaeaea',
          count: '5',
        },
      },
      1: {
        titlePosition: 'none',
        format: '#',
        gridlines: {
          color: 'transparent'
        },
      },
      2: {
        groupWidth: '100%',
        titlePosition: 'none',
        textStyle: {
          color: '#0284ff',
          bold: true,
          fontSize: 13,
        },
        format: 'decimal',
        gridlines: {
          color: 'transparent'
        },
      },
    },
    hAxis: {
      textStyle: {
        color: '#393939',
        bold: true,
        fontSize: 13,
      },
      format: 'MMM d, y',
      gridlines: {
        count: 0,
        color: 'transparent'
      },
      ticks: [],
    },
    series: {
      0: {
        targetAxisIndex: 0,
        type: 'area',
      },
      1: {
        type: 'line'
      },
      2: {
        targetAxisIndex: 2,
        type: 'bars',
        dataOpacity: 0.5,
      },
    },
    colors: [
      '#febd02',
      '#a5a5a5',
      '#0284ff',
    ],
    bar: {
      groupWidth: '35'
    },
    legend: {
      position: 'none'
    },
  }
// ['Time', 'Maximum Temperature', 'Minimum Temperature', 'Precipitation', {type: 'string', role: 'tooltip', p: {html: true}}],
//     [new Date(2020, 7, 26, 14), 19.4, 12, 22, '<div>test</div>']
    // {
    //   cols: [
    //     {id: 'President', type: 'string'},
    //     {id: 'dummy bar label', type: 'string'},
    //     {role: 'tooltip', type: 'string'},
    //     {id: 'Start', type: 'date'},
    //     {id: 'End', type: 'date'}
    //   ],

    //   rows: [
    //     {c: [{v: 'Washington'}, {v: null}, {v: 'George'}, {v: new Date(1789, 3, 30)}, {v: new Date(1797, 2, 4)}]},
    //     {c: [{v: 'Adams'}, {v: null}, {v: 'John'}, {v: new Date(1797, 2, 3)}, {v: new Date(1801, 2, 3)}]},
    //     {c: [{v: 'Jefferson'}, {v: null}, {v: 'Thomas'}, {v: new Date(1801, 2, 3)}, {v: new Date(1809, 2, 3)}]}
    //   ]
    // }
 }
 dataTimeline = []

 ngOnInit() {
  this.getEmpTimelines(); 
 }

 getEmpTimelines() {
  const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpTimelines(queryParams)
      .pipe()
      .subscribe(
        (results: any) => {
          if (results.status === 'success') {
            this.dataTimeline = results.data;
          }
        }
        ,
        error => {
        });
 }

}
