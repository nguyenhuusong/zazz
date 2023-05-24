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
  selector: 'app-tab-candidate-interview',
  templateUrl: './tab-candidate-interview.component.html',
  styleUrls: ['./tab-candidate-interview.component.scss']
})
export class TabCandidateInterviewComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetVacancyPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  }
  ]
  @Input() canId= null;
  @Output() callBack = new EventEmitter<any>();
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
    this.getCandidateInterview()
  }

  UpdateStatus() {
    this.getCandidateInterview();
  }
  
  status = [];
  selectedCountry = null;
  getCandidateInterview() {
    this.listViews = [];
    const queryParams = queryString.stringify({canId: this.canId});
    this.apiService.getCandidateInterview(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.status = results.data.flowStatuses || [];
          if(results.data.status) this.status.push(results.data.status);
          this.selectedCountry = results.data.status;
          if(this.detailInfo.actions && this.detailInfo.actions.length > 0) {
            this.initButton();
          }
        }
      });
  }

  menuActions = [];
  initButton() {
    this.optionsButon = this.detailInfo.actions.map(item => {
      return {
        label: item.name,
        value: item.code,
        icon: item.icon
      }
    });

    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this.callActions(item.code);
        }
      }
    });
  }

  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }
  
  setVacancyInfo(data) {
    if(data.event === 'actInterview' || data.event === 'actSave') {
      this.spinner.show();
      const params = {
        ...this.detailInfo, group_fields: data.datas
      }
      this.apiService.updateInterviewResult(params)
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
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getCandidateInterview();
    }else {
      this.router.navigate(['/tuyen-dung/vi-tri-tuyen-dung']);
    }
  }

}

