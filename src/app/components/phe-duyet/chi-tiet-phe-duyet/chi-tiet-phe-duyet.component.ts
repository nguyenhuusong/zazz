import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';

@Component({
  selector: 'app-chi-tiet-phe-duyet',
  templateUrl: './chi-tiet-phe-duyet.component.html',
  styleUrls: ['./chi-tiet-phe-duyet.component.scss']
})
export class ChiTietPheDuyetComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ];
  iwf_id: any = ''
  setWorkQuery = {
    iwf_id: "",
    work_type: "",
    approve_st: 0,
    reason:  ""
  }

  titlePage = '';
  displayPheDuyet = false;
  listViews_other = [];
  detailInfo_other = null;
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
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', url: '/home' },
      { label: 'Nhân sự' },
      { label: 'danh sách phê duyệt', url: '/nhan-su/phe-duyet' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
 
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.iwf_id = this.paramsObject.params.iwf_id  || null
        this.getWorkflowInfo();
      });
  };
 
  getWorkflowInfo() {
    const queryParams = queryString.stringify(this.iwf_id);
    this.apiService.getWorkflowInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }
  OnClick(e) {

  }

  setWorkApprove(data) {
    this.spinner.show();
    this.apiService.setWorkApprove(this.setWorkQuery)
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

  quaylai(data) {
    this.router.navigate(['/nhan-su/phe-duyet']);
  }

  pheDuyet() {
    this.displayPheDuyet = true;
  }

  saveCallApi(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo_other, group_fields: event
    }
    this.apiService.setWorkApprove(this.setWorkQuery)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.displayPheDuyet = false;
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

