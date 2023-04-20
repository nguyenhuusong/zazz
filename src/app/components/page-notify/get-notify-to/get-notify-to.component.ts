import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { CheckHideAction, setGroupFields } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { setOrganizeId } from 'src/app/utils/common/function-common';
import { EmployeeSaveService } from 'src/app/services/employee-save.service';
@Component({
  selector: 'app-get-notify-to',
  templateUrl: './get-notify-to.component.html',
  styleUrls: ['./get-notify-to.component.scss']
})
export class GetNotifyToComponent implements OnInit, OnDestroy, OnChanges {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Lưu thông tin cài đặt', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.EDIT_TINH_LUONG_THANH_PHAN_LUONG) ? 'hidden' : 'isEmpty thongtincaiDat', icon: 'pi pi-check' },
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Thêm dòng', value: 'ADDROW', icon: 'pi pi-plus', class: 'p-button-success' }
  ];
  titlePage = '';
  organIdSelected = '';
  @Output() detailOut = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private employeeSaveService: EmployeeSaveService,
    
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  @Input() n_id;
  @Input() modelNotifyTo;
  @Input() modelMarkdow;
  @Input() notify;
  @Input() listViewsMaster;
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.getDetail();
  }



  getDetail() {
    this.detailInfo = null;
    const params = {
      n_id: this.n_id,
      to_groups: this.modelNotifyTo.to_groups,
      to_type: this.modelNotifyTo.to_type,
      to_level: this.modelNotifyTo.to_level
    }
    this.listViews = []
    const queryParams = queryString.stringify(params);
    this.apiService.getNotifyTo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = cloneDeep(listViews);
          this.detailInfo = results.data;
        }
      });
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getDetail();
    }else {
      this.detailOut.emit();
    }
  }

  addRow() {
   
  }

  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial' || event.type === 'ADDROW') {
      const params = {
        ...this.detailInfo, group_fields: event.data, to_count: event.type === 'ADDROW' ? this.detailInfo.to_count + 1 : this.detailInfo.to_count
      };
      this.setNotifyToDraft(params)
    } 
  }

  setNotifyToDraft(params) {
    this.listViews = []
    this.detailInfo = []
    this.apiService.setNotifyToDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = cloneDeep(results.data.group_fields);
          this.detailInfo = results.data;
        }
      });
  }

  saveIsSpecial(params) {
    this.spinner.show();
    this.apiService.setNotifyTo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          const to_level = this.getValueByKey('to_level',params.group_fields);
          this.modelNotifyTo.to_level = to_level
          this.getDetail();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      };
  }

  setNotifyTo(id) {
    
  }

  handleSave(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event, sourceId: this.n_id
    };
    this.apiService.setNotifyTo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
        localStorage.removeItem('RecruitMail');
        this.router.navigate(['/cai-dat/thong-bao/chi-tiet-thong-bao'], { queryParams: { notiId: this.n_id } });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo',
          detail: results.message
        });
        this.spinner.hide();
      }
    }), error => {
      console.error('Error:', error);
      this.spinner.hide();
    };
  }

  saveNotifyMaster() {
    const group_fields= setGroupFields(this.notify.group_fields);
    const params = {
      ...this.notify, group_fields: group_fields,
      attachs: this.modelMarkdow.attachs.map(data1 => {
        return {
          attach_name: data1.attach_name,
          attach_url: data1.attach_url,
          id: data1.id,
          notiId: this.notify.notiId,
          attach_type: data1.attach_type
        }
      }),
    };
    this.apiService.setNotifyInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data.messages ? results.data.messages : 'Thành công' });
        this.setNotifyTo(results.data.id)
        this.router.navigate(['/cai-dat/thong-bao/chi-tiet-thong-bao'], { queryParams: { notiId: results.data.id } });
        localStorage.removeItem('RecruitMail');
      }else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo',
          detail: results.message
        });
        this.spinner.hide();
      }
    })


  }

  getValueByKey(key, dataViewNew) {
    if (dataViewNew && dataViewNew.length > 0) {
      let value = ''
      for (let i = 0; i < dataViewNew.length; i++) {
        for (let j = 0; j < dataViewNew[i].fields.length; j++) {
          if (dataViewNew[i].fields[j].field_name === key) {
            value = dataViewNew[i].fields[j].columnValue;
            break;
          }
        }
      }
      return value
    }
  }
}

