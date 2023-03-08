import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-grid',
  templateUrl: './loading-grid.component.html',
  styleUrls: ['./loading-grid.component.css']
})
export class LoadingGridComponent implements OnInit {
  @Input() gridtype = 'hsns';
  @Input() columnNumber = 17;
  listThs = [];
  ngOnInit(): void {
    this.listThs = Array(this.columnNumber).fill(1).map((x,i)=>i)
    
  }
}