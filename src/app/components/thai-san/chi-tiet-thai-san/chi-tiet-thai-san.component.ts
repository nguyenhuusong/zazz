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
  selector: 'app-chi-tiet-thai-san',
  templateUrl: './chi-tiet-thai-san.component.html',
  styleUrls: ['./chi-tiet-thai-san.component.scss']
})
export class ChiTietThaiSanComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ];
  modelEdit = {
    maternityId: 0,
  }
  titlePage = '';
  listsDataMaternityPregnancy = [];
  listsDataMaternityChild = [];
  columnDefMaternityChild = [];
  columnDefMaternityPregnancy = [];
  displayAddThaiSan = false;
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
      { label: 'Tuyển dụng' },
      { label: 'danh sách thai sản', url: '/nhan-su/thai-san' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
 
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.maternityId = this.paramsObject.params.maternityId || null
        this.getMaternityInfo();
      });
  };
 
  getMaternityInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getMaternityInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.listsDataMaternityPregnancy = [...this.detailInfo.maternityPregnancy]
          this.listsDataMaternityChild = [...this.detailInfo.maternityChild]
          this.aGridFnMaternityChild(this.detailInfo.gridflexdetails1)
          this.aGridFnMaternityPregnancy(this.detailInfo.gridflexdetails2)
        }
      });
  }

  aGridFnMaternityChild(table) {
    this.columnDefMaternityChild = [
      ...AgGridFn(table),
    ];
  }

  OnClick(e) {

  }

  aGridFnMaternityPregnancy(table) {
    this.columnDefMaternityPregnancy = [
      ...AgGridFn(table),
    ];
  }

  setMaternityInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setMaternityInfo(params)
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
    this.router.navigate(['/nhan-su/thai-san']);
  }
  modelAdd = {
    title: '',
    set: 'SetMaternityPregnancyInfo'
  }

  addKhamThai() {
    this.displayAddThaiSan = false;
    this.listViews_other = [];
    this.modelAdd = {
      title: 'Thêm mới khám thai',
      set: 'SetMaternityPregnancyInfo'
    }
    const queryParams = queryString.stringify({pregnancId : 0});
    this.getMaternityPregnancInfo(queryParams)
  }
  
  getMaternityPregnancInfo(queryParams) {
    this.apiService.getMaternityPregnancInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews_other = listViews;
        this.detailInfo_other = results.data;
        this.displayAddThaiSan = true;
      }
    })
  }

  getMaternityChildInfo(queryParams) {
    this.apiService.getMaternityChildInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews_other = listViews;
        this.detailInfo_other = results.data;
        this.displayAddThaiSan = true;
      }
    })
  }

  addConNho() {
    this.displayAddThaiSan = false;
    this.listViews_other = [];
    this.modelAdd = {
      title: 'Thêm mới con nhỏ',
      set: 'SetMaternityChildInfo'
    }
    const queryParams = queryString.stringify({childId : 0});
    this.getMaternityChildInfo(queryParams);
  }

  saveCallApi(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo_other, group_fields: event
    }
    this.apiService.setMaternityPregnancyInfo(this.modelAdd.set,params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.displayAddThaiSan = false;
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

