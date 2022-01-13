import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'child-number',
  template: `
  <input type="number" value="TotalQty" class="my-custom-input-class" style="width : 100%">
    `
})
export class NumberCellRenderer implements OnInit {
  value: string
  constructor() { }

  agInit(params: any) {
      console.log(params)
    this.value = params.value;
  }
  ngOnInit() {
  }
}
