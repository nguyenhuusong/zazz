import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-emp-attach-file',
  templateUrl: './emp-attach-file.component.html',
  styleUrls: ['./emp-attach-file.component.css']
})
export class EmpAttachFileComponent implements OnInit {
  @Input() modelAttach = null
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
  ) { }
  listViews = [];
  detailInfo= null
  ngOnInit(): void {
    this.getContractInfo();
  }
  getContractInfo() {
    this.listViews  = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.modelAttach);
    this.apiService.getEmpAttach(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }
  setUploadFile(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.spinner.show();
    this.apiService.setEmpAttach(params).subscribe(results => {
      if(results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data: 'Thêm mới file đình kèm thành công !'});
        this.callback.emit();
        this.spinner.hide();
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message});
        this.spinner.hide();
      }
    })
  }


  huy() {
    this.back.emit();
  }
}
