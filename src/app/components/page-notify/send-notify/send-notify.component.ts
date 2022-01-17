import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';

@Component({
  selector: 'app-send-notify',
  templateUrl: './send-notify.component.html',
  styleUrls: ['./send-notify.component.css']
})
export class SendNotifyComponent implements OnInit, AfterViewInit {
  loading = false;
  typeSend = 'some';
  constructor(
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private apiService: ApiHrmService,
    private cdr: ChangeDetectorRef) { }

  @Input() notify;
  @Input() indexTab;
  @Input() moduleLists;
  @Output() reload = new EventEmitter<any>();
  mockActions = [
    { label: 'Notification', value: 'push' },
    { label: 'SMS', value: 'sms' },
    { label: 'Email', value: 'email' }
  ];
  actions = [];
  apartmentSelected = [];
  action;

  ngAfterViewInit(): void {
    this.initTypeNotify();
  }

  ngOnInit(): void {
  }
  tempActions = []
  initTypeNotify() {
    this.actions = []
    this.notify.group_fields.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === 'actionlist') {
          const actions = element1.columnValue.split(",");
          for(let item of this.mockActions) {
            if(actions.indexOf(item.value) > -1) {
              this.actions.push(item)
            }
          }
          this.action = this.actions[0].value
        }
      });
    });
  }

  handleSendNotify(data) {
    if (data === 'hide') {
      this.reload.emit();
    } else {
      if (!this.action) {
        this.confirmationService.confirm({
          message: 'Bạn chưa chọn loại thông báo',
          rejectVisible: false,
          acceptLabel: 'Oke',
          accept: () => { }
        });
        return;
      }

      if (data.length === 0) {
        const dataSave = {
          ids: data.map(item => item.id),
          // notiId: this.notify.notiId,
          n_id: this.notify.n_id,
          action: this.action
        };
        this.setNotifyToPushRun(dataSave);
      }else {
        const dataSave = {
          ids: data.map(item => item.id),
          // notiId: this.notify.n_id,
          n_id: this.notify.n_id,
          action: this.action
        };
        this.setNotifyToPushRun(dataSave);
      }
    
    }
  }

  setNotifyToPushRun(dataSave) {
    this.spinner.show();
    this.apiService.setNotifyToPushRun(dataSave).subscribe((result: any) => {
      if (result.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: result.data ? result.data : 'Thành công' });
        this.spinner.hide();
        this.reload.emit();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: result.message ? result.message : 'Thất bại' });
        this.spinner.hide();
      }
    });
  }

}
