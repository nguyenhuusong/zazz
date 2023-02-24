import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uni-common',
  templateUrl: './uni-common.component.html',
  styleUrls: ['./uni-common.component.scss']
})
export class UniCommonComponent implements OnInit {

  constructor() { }

  icons = [];
  ngOnInit(): void {
    this.getIcons();
  }

  getIcons() {
    this.icons = [
      { name: 'arrow-down', color: 'rgb(233, 73, 74)' },
      { name: 'arrow-up', color: 'rgb(233, 127, 51)' },
      { name: 'board', color: 'rgb(94 108 132)' },
      { name: 'bug', color: '' },
      { name: 'chevron-down', color: '' },
      { name: 'cog', color: '' },
      { name: 'component', color: '' },
      { name: 'feedback', color: '' },
      { name: 'filters', color: '' },
      { name: 'help', color: '' },
      { name: 'github', color: '' },
      { name: 'link', color: '' },
      { name: 'no-result', color: '' },
      { name: 'page', color: '' },
      { name: 'plus', color: '' },
      { name: 'ship', color: '' },
    ]
  }

}
