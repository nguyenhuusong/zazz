import { Component, Input, } from '@angular/core';
@Component({
  selector: 'app-hrm-filter',
  templateUrl: './hrm-filter.component.html',
  styleUrls: ['./hrm-filter.component.css'],
})
export class HrmFilterCrumbComponent {
  @Input() items: any = [];
  @Input() displayTitle = true;
  @Input() title = '';
  constructor(
  ) { }
  contentTypes = [];

  ngOnInit(): void {
    
  }

}
