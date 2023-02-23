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
    { label: 'Quay lại', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: '', icon: 'pi pi-check' }
  ];
  wft_id: any = ''
  setWorkQuery = {
    wft_id: "",
    work_type: "",
    approve_st: 0,
    reason: ""
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
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Nhân sự' },
      { label: 'danh sách phê duyệt', routerLink: '/nhan-su/phe-duyet' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.wft_id = this.paramsObject.params.wft_id || null
        this.getWorkflowInfo();
      });
  };

  getWorkflowInfo() {
    const queryParams = queryString.stringify({ wft_id: this.wft_id });
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
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setWorkApprove(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.router.navigate(['/nhan-su/phe-duyet']);
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
    if (data === 'CauHinh') {
      this.getWorkflowInfo();
    } else if (data === 'NghiViec') {
      this.xulybangiao();
    } else {
      this.router.navigate(['/nhan-su/phe-duyet']);
    }
  }


  displayChangeStatus = false;
  modelPheDuyet = {
    id: '',
    status_key: '',
    status: 1,
    comment: '',
    status_dt: new Date()
  }
  listTerminateKey = [];

  xulybangiao() {
    this.modelPheDuyet = {
      id: this.detailInfo.tnx_id,
      status_key: this.listTerminateKey.length > 0 ? this.listTerminateKey[0].value : '',
      status: 1,
      comment: '',
      status_dt: new Date()
    }
    this.displayChangeStatus = true;
  }

  getCustObjectListNew() {
    // const opts1 = { params: new HttpParams({ fromString: `objKey=terminate_key` }) };
    // this.apiService.getObjectGroup(opts1.params.toString()).subscribe(results => {
    //   this.listTerminateKey = results.data.map(d => {
    //     return {
    //       name: d.name,
    //       code: d.value
    //     }
    //   });

    //   this.listTerminateKey = [...this.listTerminateKey]
    // });
  }

  xacnhan() {
    this.getWorkflowInfo();
    this.displayChangeStatus = false;
  }


  pheDuyet() {
    this.displayPheDuyet = true;
  }
}

