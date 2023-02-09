import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-info',
  templateUrl: './step-info.component.html',
  styleUrls: ['./step-info.component.scss']
})
export class StepInfoComponent implements OnInit {
  @Input() detailInfo = null;
  constructor(
    private changeDetech: ChangeDetectorRef,
  ) { }
  stepsLine = [];

  ngAfterViewChecked() {
    this.changeDetech.detectChanges();
  }

  ngOnInit(): void {
    this.activeIndex = this.detailInfo.flow_st || 0
    this.stepsLine = this.detailInfo?.workstatuses?.map(d => {
      return {
        label: d.flow_name,
        value: d.status
      }
    });
    setTimeout(() => {
      this.stepActivated();
    }, 100)
  }
  activeIndex = 0;
  stepActivated(): void {
    const stepS = document.querySelectorAll('.status-line .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.stepsLine.length; i++) {
        stepS[i].className += `p-highlight ${this.stepsLine[i].value}`;
      }
    }
  }


}
