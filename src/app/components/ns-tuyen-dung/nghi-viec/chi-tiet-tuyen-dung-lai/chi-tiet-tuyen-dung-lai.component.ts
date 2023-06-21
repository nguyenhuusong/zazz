
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
  selector: 'app-chi-tiet-tuyen-dung-lai',
  templateUrl: './chi-tiet-tuyen-dung-lai.component.html',
  styleUrls: ['./chi-tiet-tuyen-dung-lai.component.scss']
})
export class ChiTietTuyenDungLaiComponent implements OnInit, OnDestroy {
  @Input() empId = null;
  @Input() terminateId = null;
  @Output() callback = new EventEmitter<any>();
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetVacancyPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ]
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
      this.getCandidateAgain();
    // this.titlePage = this.activatedRoute.data['_value'].title;
    // this.items = [
    //   { label: 'Trang chủ' , routerLink: '/home' },
    //   { label: 'Tuyển dụng' },
    //   { label: 'Mail tuyển dụng', routerLink: '/tuyen-dung/mail-tuyen-dung' },
    //   { label: `${this.titlePage}` },
    // ];
    // this.handleParams();
  }
  modelEdit = {
    empId: null,
  }
  titlePage = '';
  configData = []
  
  handleParams() {
    
  };

  getCandidateAgain() {
    const queryParams = queryString.stringify({terminateId: this.terminateId});
    this.apiService.getCandidateAgain(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setCandidateInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setCandidateInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.callback.emit();
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

  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setCandidateDraft(params);
    }
  }

  setCandidateDraft(params) {
    this.apiService.setCandidateDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getCandidateAgain();
    }else {
      this.callback.emit();
    }
  }
}

