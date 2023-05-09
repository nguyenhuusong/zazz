
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-cai-dat-tien-trinh',
  templateUrl: './chi-tiet-cai-dat-tien-trinh.component.html',
  styleUrls: ['./chi-tiet-cai-dat-tien-trinh.component.scss']
})
export class ChiTietCaiDatTienTrinhComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetLeavePage.url, ACTIONS.EDIT) ? 'hidden' : ''
    , icon: 'pi pi-check'  }
  ];
  @Input() flowId = null;
  @Output() callback = new EventEmitter<any>();
  url: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getFlowType();
  }

  getFlowType() {
    const queryParams = queryString.stringify({ flowId: this.flowId });
    this.apiService.getFlowType(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }
  setFlowType(data) {
      const params = {
        ...this.detailInfo, group_fields: data
      }
      this.apiService.setFlowType(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.callback.emit();
          this.spinner.hide();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }
  // setCandidateInfo(data) {
  //   this.spinner.show();
  //   const params = {
  //     ...this.detailInfo, group_fields: data
  //   }
  //   this.apiService.setCandidateInfo(params)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((results: any) => {
  //       if (results.status === 'success') {
  //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
  //         this.spinner.hide();
  //       } else {
  //         this.messageService.add({
  //           severity: 'error', summary: 'Thông báo',
  //           detail: results.message
  //         });
  //         this.spinner.hide();
  //       }
  //     }), error => {
  //       this.spinner.hide();
  //     };
  // }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getFlowType();
    }else {
      this.callback.emit();
    }
  }

}


