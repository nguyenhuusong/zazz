import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { CheckHideAction } from 'src/app/common/function-common/common';

@Component({
  selector: 'app-form-active',
  templateUrl: './form-active.component.html',
  styleUrls: ['./form-active.component.scss']
})
export class FormActiveComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  @Input()ID
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  }
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
    this.modelEdit.id = this.ID
  }
  modelEdit = {
    id: "",
  }

  getUserSalary() {
    // this.apiService.getUserSalary()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(results => {
    //     if (results.status === 'success') {
    //       const listViews = cloneDeep(results.data.group_fields);
    //       this.listViews = [...listViews];
    //       this.detailInfo = results.data;
    //     }else {
    //       this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
    //     }
    //   });
  }

  setUserSalaryInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setUserSalaryInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/chinh-sach/chuyen-vien-tinh-luong']);
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

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getUserSalary();
    }else {
      this.router.navigate(['/chinh-sach/chuyen-vien-tinh-luong']);
    }
  }

  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setUserSalaryDraft(params);
    } 
  }


  setUserSalaryDraft(params: any) {
    this.spinner.show();
  
    this.apiService.setUserSalaryDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
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

