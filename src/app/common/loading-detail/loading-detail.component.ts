import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-detail',
  templateUrl: './loading-detail.component.html',
  styleUrls: ['./loading-detail.component.css']
})
export class LoadingDetailComponent implements OnInit {

  @Input() id: string = '';

  dataLongField = [];
  dataShortField = [];
  dataFieldArea = [];
  dataMarkdown = [];
  
  ngOnInit(): void {
    this.setDataFullWidth();
    this.setDataShortField();
    this.setDataFieldArea();
    this.setDataMarkdown();
    
  }

  setDataFullWidth() {
    this.dataLongField = [
      { col: '6' },
      { col: '6' },
      { col: '8' },
      { col: '4' },
      { col: '4' },
      { col: '2' },
      { col: '2' },
      { col: '2' },
      { col: '2' },
    ]
  }
  setDataShortField() {
    this.dataShortField = [
      {col: 4},
      {col: 2},
      {col: 2},
      {col: 2},
      {col: 2},
        {col: 2},
        {col: 2},
        {col: 2},
        {col: 2},
        {col: 4},
      {col: 4},
      {col: 2},
      {col: 2},
      {col: 2},
      {col: 2},
    ]
  }
  
  setDataFieldArea() {
    this.dataFieldArea = [
      { col: '6', height: '34px' },
      { col: '3', height: '34px' },
      { col: '3', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '12', height: '108px' },
    ]
  }

  setDataMarkdown() {
    this.dataMarkdown = [
      { col: '3', height: '34px' },
      { col: '3', height: '34px' },
      { col: '6', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '4', height: '34px' },
      { col: '12', height: '450px' },
    ]
  }
}