import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { chunk } from 'lodash'
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import * as queryString from 'querystring';
import { getFieldValueAggrid } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-send-notify',
  templateUrl: './send-notify.component.html',
  styleUrls: ['./send-notify.component.css']
})
export class SendNotifyComponent implements OnInit, AfterViewInit,OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
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
  action: any = [];
  run_act = 0
  ngAfterViewInit(): void {
    // this.initTypeNotify();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getObjectsNotifyTemplate();
    // this.action = [ 'email']
  }

  ngOnChanges(changes: SimpleChanges): void {

    // if (this.notify) { 
    //   this.initTypeNotify();
    // }
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
    if (data.data === 'hide') {
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
      if(data.run_act === 2){
        this.run_act = data.run_act;
      }

      const ids = chunk(data.data.map(item => item.id), 10);
      let listAPis: any = []
      for (let items of ids) {
        const dataSave = {
          ids: items,
          n_id: this.notify.n_id,
          action: this.action.toString(),
          run_act: this.run_act
        };

        listAPis.push(this.apiService.setNotifyToPushRun(dataSave))
      }
      this.spinner.show();
      forkJoin(listAPis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Gửi thành công' });
        this.spinner.hide()
        this.reload.emit();
      })
    }
  }

  setNotifyToPushRun(dataSave) {
    this.spinner.show();
    this.apiService.setNotifyToPushRun(dataSave)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: any) => {
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

  getObjectsNotifyTemplate(){
    this.action = getFieldValueAggrid(this.notify, 'actionlist', '');
    this.action = this.action.split(',')
    const queryParams = queryString.stringify({ objKey: 'notify_template' });
    this.apiService.getObjects(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.actions = results.data.map( d => {
          return {
            label: d.name, 
            name: d.name, 
            code: d.value,
            value: d.value,
          }
        });
      }
    })
  }


}
