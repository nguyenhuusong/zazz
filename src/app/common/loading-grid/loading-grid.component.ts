import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-grid',
  templateUrl: './loading-grid.component.html',
  styleUrls: ['./loading-grid.component.css']
})
export class LoadingGridComponent implements OnInit {
  @Input() gridtype = 'hsns';
  @Input() columnNumber = 17;
  @Input() value = [1,2,3,4,5,6,7,84,4,3,4,5,6,7,45,67,7,45,67,67,67];
  listThs = [];
  ngOnInit(): void {
    this.listThs = Array(this.columnNumber).fill(1).map((x,i)=>i)
    
  }
}