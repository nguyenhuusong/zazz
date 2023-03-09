import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-field',
  templateUrl: './loading-field.component.html',
  styleUrls: ['./loading-field.component.css']
})
export class LoadingFieldComponent implements OnInit {
  @Input() width = '100%';
  @Input() widthLabel = '120px';
  @Input() height = '34px';
  ngOnInit(): void {
    
  }
}