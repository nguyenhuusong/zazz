import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { CheckHideAction } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-thue-bao-hiem',
  templateUrl: './chi-tiet-thue-bao-hiem.component.html',
  styleUrls: ['./chi-tiet-thue-bao-hiem.component.scss']
})
export class ChiTietThueBaoHiemComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  @Input() empId = null;
  @Output() cancelSave = new EventEmitter<any>();
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
  
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
    this.handleParams();
  }
  modelEdit = {
    empId: null,
    edit_is: true
  }
  titlePage = ''
  handleParams() {
    this.modelEdit.empId = this.empId || ""
    this.getEmpByInsurance();
  };

  getEmpByInsurance() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getEmpByInsurance(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setEmpByInsuranceInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setEmpByInsurance(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.cancelSave.emit();
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
    if (data === 'CauHinh') {
      this.getEmpByInsurance();
    } else {
      this.cancelSave.emit();
    }
  }

}


