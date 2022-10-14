import { Component, Input, } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-hrm-filter',
  templateUrl: './hrm-filter.component.html',
  styleUrls: ['./hrm-filter.component.css'],
})
export class HrmFilterCrumbComponent {
  @Input() data:any = [];
  constructor(
    private apiService: ApiHrmService,
  ) { }
  contentTypes = [];

  ngOnInit(): void {
    this.apiService
  }

}
