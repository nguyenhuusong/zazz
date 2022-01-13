import { Component, ElementRef, ViewChild, OnInit, AfterContentInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-loading-overlay',
    template: `
  
    `,
    styles: [
        `
  .custom-date-filter a {
    position: absolute;
    right: 7px;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
  }
    `
    ]
})

// <div class="ag-input-wrapper custom-date-filter">
//             <input bsDatepicker type='text' style="width: 100%" placeholder="dd/mm/yyyy"
//             [bsValue]="bsInlineValue" (bsValueChange)="onDateChanged($event)"
//             [bsConfig]="{ dateInputFormat: 'DD/MM/YYYY' }"
//             />
//             <a class='input-button' title='clear' (click)='clear()'>
//                 <i class='fa fa-times'></i>
//             </a>
//         </div>
export class CustomDateComponent implements OnInit, AfterViewInit, OnDestroy{

    private date: Date;
    private params: any;
    private picker: any;
    private bsInlineValue: string;

    ngOnInit() {
    }

    agInit(params: any): void {
        this.params = params;
        console.log(params);
    }

    ngAfterViewInit(): void {
    }

    refresh(params?: any): boolean {
        return true;
      }

    ngOnDestroy() {
        console.log(`Destroying DateComponent`);
    }

    onDateChanged(selectedDates) {
        this.picker = {
            onChange: this.onDateChanged.bind(this),
            wrap: true
        };
        this.date = selectedDates || null;
        this.setDate(selectedDates);
        this.params.onDateChanged(this.picker);
    }

    getDate(): Date {
        return this.date;
    }

    setDate(date: Date): void {
        this.date = date || null;
        // this.picker.setDate(date);
    }

    clear() {
        console.log(this.params);
        this.bsInlineValue = '';
        this.onDateChanged('');
    }
}
