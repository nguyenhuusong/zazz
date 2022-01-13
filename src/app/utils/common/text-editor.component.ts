import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-text-editor',
  template: `
  <input type="text" value="TotalQty" class="my-custom-input-class" style="width : 100%">
    `
})
export class TextEditorComponent implements OnInit {
  value: string;
  constructor() { }

  agInit(params: any) {
    this.value = params.value;
  }
  ngOnInit() {
  }

}
