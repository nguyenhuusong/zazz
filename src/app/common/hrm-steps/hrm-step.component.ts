import { Component, Input, } from '@angular/core';
@Component({
  selector: 'app-hrm-step',
  templateUrl: './hrm-step.component.html',
  styleUrls: ['./hrm-step.component.css'],
})
export class HrmStepComponent {
  @Input() steps: any = [];
  @Input() flowSt: any = [];
  constructor(
  ) { }

  activeIndex = 0;
  ngOnInit(): void {
    this.activeIndex = this.flowSt || 0
    this.steps = this.steps.map(d => {
      return {
        label: d.flow_name,
        value: d.flow_st
      }
    });
    setTimeout(() => {
      this.stepActivated();
    }, 100)
    if(this.steps && this.steps.length > 0) {
      this.getStep()
    }
  }

  getStep() {
    this.steps = this.steps.sort( ( a, b) => a.value - b.value );
    this.steps = this.steps.map( (d, index) => {
      return {
        label: d.label,
        value: index
      } 
    })
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.status-line .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i < this.activeIndex) {
          stepS[i].className += ' p-highlight active';
        }else if(i === this.activeIndex){
          stepS[i].className += ' p-highlight active p-steps-current';
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

}
