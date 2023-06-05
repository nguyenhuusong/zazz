import { Directive, OnInit, ElementRef, Input, Output, AfterViewInit, SimpleChanges, HostListener, OnChanges, AfterViewChecked, AfterContentChecked, EventEmitter, NgModule } from '@angular/core';
import * as numeral from 'numeral';
declare var $: any
@Directive({
  selector: '[currency]',
  host: {
    '(change)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)'
  }
})
export class CurrencyDirective implements OnInit, AfterViewInit, AfterContentChecked {
  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef,
    // public model
  ) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
  }
  ngAfterContentChecked() {

  }
  onInputChange(event: any, backspace: any) {
    if (event) {
      if (event.target) {
        let newVal = numeral(event.target.value).format('0,0[.]00');
        // // var myNumeral2 = numeral(newVal);
        // // var value2 = myNumeral2.value();
        var rawValue = newVal;
        console.log(newVal)
        event.target.value = newVal
        // this.model = newVal
        this.rawChange.emit(rawValue)
      }
    }

  }
}
