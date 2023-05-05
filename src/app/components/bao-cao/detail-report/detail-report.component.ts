import { Component, Input, OnInit } from '@angular/core';
import { AgGridFn } from 'src/app/common/function-common/common';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  columnDefs = [];
  @Input() listsData = [];
  @Input() cols = [];
  constructor() { }

  ngOnInit(): void {
    this.initGrid();
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
  }

}
