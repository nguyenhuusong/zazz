import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { getValueOfField, setOrganizeId } from 'src/app/utils/common/function-common';

@Component({
  selector: 'app-chi-tiet-bien-dong-bhxh',
  templateUrl: './chi-tiet-bien-dong-bhxh.component.html',
  styleUrls: ['./chi-tiet-bien-dong-bhxh.component.scss']
})
export class ChiTietBienDongBHXHComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetMaternityPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
  modelEdit = {
    insuranceId: null,
    empId: null,
  }
  titlePage = '';
  listsDataMaternityPregnancy = [];
  listsDataMaternityChild = [];
  columnDefMaternityChild = [];
  columnDefMaternityPregnancy = [];
  displayAddThaiSan = false;
  empId = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private organizeInfoService: OrganizeInfoService,
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
      { label: 'Quan hệ lao động' },
      { label: 'danh sách biến động bảo hiểm xã hội', routerLink: '/nhan-su/bien-dong-bhxh' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
    this.organizeInfoService.fetchAll();
  }
 
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.insuranceId = this.paramsObject.params.insuranceId || null;
        this.modelEdit.empId = this.paramsObject.params.empId || null;
        this.empId = this.paramsObject.params.empId || null;
        this.getInfo();
      });
  };
 
  getInfo() {
    this.detailInfo = [];
    this.listViews = [];
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getEmpInsuranceInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;

          // this.initGrid();
        }
      });
  }


  setInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setEmpInsuranceInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.goBack()
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

  goBack() {
      this.router.navigate(['/nhan-su/bien-dong-bhxh']);
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getInfo();
    }else {
      this.router.navigate(['/nhan-su/bien-dong-bhxh']);
    }
  }
  modelAdd = {
    title: '',
    set: 'SetMaternityPregnancyInfo'
  }

}

