import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-tab-thiet-lap-tham-so',
  templateUrl: './chi-tiet-tab-thiet-lap-tham-so.component.html',
  styleUrls: ['./chi-tiet-tab-thiet-lap-tham-so.component.scss']
})
export class ChiTietTabThietLapThamSoComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.EDIT_TINH_LUONG_THIET_LAP_THAM_SO) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
  titlePage = '';
  @Input() idForm: string = null;
  @Output() detailOut = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getDetail();
   
  }

  getDetail() {
    const queryParams = queryString.stringify({Id: this.idForm});
    this.apiService.getPayrollParam(queryParams)
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

  handleSave(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event
    };
    this.apiService.setPayrollParam(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.detailOut.emit();
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
}

