import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction, AgGridFn } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { stringify } from 'querystring';
@Component({
  selector: 'app-chi-tiet-tuyen-dung',
  templateUrl: './chi-tiet-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-tuyen-dung.component.scss']
})
export class ChiTietTuyenDungComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  }
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
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Tuyển dụng'},
      { label: 'Danh sách tuyển dụng', routerLink: '/tuyen-dung/ds-tuyen-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  modelEdit = {
    canId: null,
  }
  titlePage = '';
  isView = false;
  columnDefs = [];
  listData = [];
  heightGrid = 300;
  gridKey = '';
  cols = [];
  detailEdit = null
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.canId = this.paramsObject.params.canId || null;
        this.isView = this.paramsObject.params.view
        
        if(!this.isView) {
          this.getCandidateInfo();
        }else{
          this.getCandidatesViewInfo();
        }
      });
  };

  getCandidateInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getCandidateInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  getCandidatesViewInfo() {
    this.columnDefs = [];
    this.listData = []
    const query = { canId: this.modelEdit.canId }
    this.apiService.getCandidatesViewInfo(stringify(query))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.cols = results.data.gridflexdetails1;
        this.listData = results.data.recruitCandidates;
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = [...listViews];
        this.detailInfo = results.data;
        this.initGrid();
      }
    });

    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getCandidateInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.detailEdit = results.data
        }
      });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
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
          this.router.navigate(['/tuyen-dung/ds-tuyen-dung']);
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
      this.getCandidateInfo();
    }else {
       this.router.navigate(['/tuyen-dung/ds-tuyen-dung']);
    }
  }


}


