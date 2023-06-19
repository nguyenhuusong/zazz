import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-cs-giai-trinh-cong',
  templateUrl: './cs-giai-trinh-cong.component.html',
  styleUrls: ['./cs-giai-trinh-cong.component.scss']
})
export class CsGiaiTrinhCongComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetLeavePage.url, ACTIONS.EDIT) ? 'hidden' : ''
    , icon: 'pi pi-check'  }
  ]
  url: string = '';
  @Input() timekeepingId = null;
  @Output() callback= new EventEmitter<any>();
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
    this.getLeaveExplan();
  } 

  getLeaveExplan() {
    const queryParams = queryString.stringify({ timekeepingId: this.timekeepingId });
    this.apiService.getLeaveExplan(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setLeaveHrmInfo(data) {
      const params = {
        ...this.detailInfo, group_fields: data
      }
      this.apiService.setLeaveHrmInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
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
      this.getLeaveExplan();
    }else {
      this.callback.emit();
    }
  }

}


