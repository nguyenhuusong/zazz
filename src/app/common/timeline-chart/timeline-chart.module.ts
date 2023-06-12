import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component';


@NgModule({
  declarations: [TimelineChartComponent],
  imports: [
    CommonModule,
    Ng2GoogleChartsModule
  ],
  exports: [TimelineChartComponent]
})
export class TimelineChartModule { }
