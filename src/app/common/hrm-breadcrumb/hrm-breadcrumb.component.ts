import { Component, Input, } from '@angular/core';
@Component({
  selector: 'app-hrm-breadcrumb',
  templateUrl: './hrm-breadcrumb.component.html',
  styleUrls: ['./hrm-breadcrumb.component.css'],
})
export class HrmBreadCrumbComponent {
  @Input() items: any = [];
  @Input() displayTitle = true;
  @Input() title = '';
  constructor(
  ) { }
  contentTypes = [];

  ngOnInit(): void {
    
  }

}
