import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
  declarations: [TimelineChartComponent],
  imports: [
    CommonModule,
    Ng2GoogleChartsModule,
    TimelineModule
  ],
  exports: [TimelineChartComponent]
})
export class TimelineChartModule { }
