import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-checkbox-renderer',
  template: `
      <input type="checkbox" (change)="onchange($event)" checked="{{value}}" class="my-custom-input-class" style="width : 100%;justify-content :center;">
    `
})
export class CheckboxEditorComponent implements OnInit {
  value: boolean;
  constructor() { }

  agInit(params: any) {
    this.value = params.value;
  }
  ngOnInit() {
  }

  onchange(event) {
    console.log(event)
  }

}
