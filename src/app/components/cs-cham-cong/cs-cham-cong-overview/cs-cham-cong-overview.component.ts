import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cs-cham-cong-overview',
  templateUrl: './cs-cham-cong-overview.component.html',
  styleUrls: ['./cs-cham-cong-overview.component.scss']
})
export class CsChamCongOverviewComponent implements OnInit {

  items = [];
  dataSeleted = 1;
  dataOptions = [
    { label: 'Hôm nay', value: 1}
  ]
  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách chấm công' },
      { label: 'Tổng quan' },
    ];
  }

}
