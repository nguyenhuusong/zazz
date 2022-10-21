import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uni-not-found',
  templateUrl: './uni-not-found.component.html',
  styleUrls: ['./uni-not-found.component.scss']
})
export class UniNotFoundComponent implements OnInit {

  constructor() { }

  items = [];
  ngOnInit(): void {
    this.items = [
      { label: '404'},
    ];
  }

}
