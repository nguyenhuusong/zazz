import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-hrm-filter-report',
  templateUrl: './hrm-filter-report.component.html',
  styleUrls: ['./hrm-filter-report.component.scss'],
})
export class HrmFilterReportComponent {
  constructor(
    private apiService: ApiHrmService,
  ) { }

  @Input() fields: any = [];
  @Output() queryData = new EventEmitter<any>();
  ngOnInit(): void {
    this.apiService
  }

  find(type) {
    this.queryData.emit({
      type: type,
      query: this.fields
    })
  }

}
