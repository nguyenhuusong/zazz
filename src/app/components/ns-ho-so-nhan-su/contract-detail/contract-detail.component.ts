import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit {
  @Input() modelContractInfo: any = null
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButon = [];
  steps = [];
  activeIndex = 0
  ngOnInit(): void {
    console.log(this.modelContractInfo.contractId)
    if(this.modelContractInfo.contractId) {
      this.getContractInfo();
    }else {
      this.setContractCreate();
    }
    this.initStep();
  }
  detailInfo = null;
  listViews = [];
  setContractCreate() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    this.apiService.setContractCreate({empId: this.modelContractInfo.empId}).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }

  cancel(data) {
    if(data === 'CauHinh') {
      this.modelContractInfo.contractId ? this.getContractInfo() : this.setContractCreate();
    }else {
      this.back.emit();
    }
  }

  setContractInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.spinner.show();
    this.apiService.setContractInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Tạo hợp đồng thành công' });
        this.callback.emit();
        this.spinner.hide();
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getContractInfo() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({contractId: this.modelContractInfo.contractId});
    this.apiService.getContractInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }
 
  initStep(){
    this.steps = [{
      label: 'Personal',
      command: (event: any) => {
          this.activeIndex = 0;
          this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label});
      }
  },
  {
      label: 'Seat',
      command: (event: any) => {
          this.activeIndex = 1;
          this.messageService.add({severity:'info', summary:'Seat Selection', detail: event.item.label});
      }
  },
  {
      label: 'Payment',
      command: (event: any) => {
          this.activeIndex = 2;
          this.messageService.add({severity:'info', summary:'Pay with CC', detail: event.item.label});
      }
  },
  {
      label: 'Confirmation',
      command: (event: any) => {
          this.activeIndex = 3;
          this.messageService.add({severity:'info', summary:'Last Step', detail: event.item.label});
      }
  }
];
  }

}
