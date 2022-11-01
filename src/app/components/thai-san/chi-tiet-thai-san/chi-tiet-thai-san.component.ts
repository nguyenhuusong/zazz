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
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetMaternityPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
  modelEdit = {
    maternityId: null,
    keyObj: '',
  }
  titlePage = '';
  listsDataMaternityPregnancy = [];
  listsDataMaternityChild = [];
  columnDefMaternityChild = [];
  columnDefMaternityPregnancy = [];
  displayAddThaiSan = false;
  listViews_other = [];
  detailInfo_other = null;
  columnDefDetail = []
  colsDetail = []
  dataDetail = []
  heightGrid = 300
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
      { label: 'Tuyển dụng' },
      { label: 'danh sách thai sản', routerLink: '/nhan-su/thai-san' },
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
        this.modelEdit.maternityId = this.paramsObject.params.maternityId || null
        this.getMaternityInfo();
        this.getChiTietForDsThaiSan();
      });
  };

  getChiTietForDsThaiSan() {
    
    this.columnDefDetail = []
    this.dataDetail = []
    this.colsDetail = [];
    this.modelEdit.keyObj = '';
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getMaternityInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          if(results.data.gridflexs){
            this.colsDetail = results.data.gridflexs;
          }
          this.dataDetail = results.data.data;
          this.initGrid();
        }
      });
  }
 
  getMaternityInfo() {
    this.colsDetail = [];
    this.dataDetail = [];
    this.detailInfo = [];
    this.listViews = [];
    this.modelEdit.keyObj = '';
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getMaternityInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.listsDataMaternityPregnancy = [...this.detailInfo.maternityPregnancy || []]
          this.listsDataMaternityChild = [...this.detailInfo.maternityChild || []]
          this.aGridFnMaternityChild(this.detailInfo.gridflexdetails1 || [])
          this.aGridFnMaternityPregnancy(this.detailInfo.gridflexdetails2 || []);
          // if(results.data.gridflexs){
          //   this.colsDetail = results.data.gridflexs;
          // }
          this.dataDetail = results.data.data;

          // this.initGrid();
        }
      });
  }

  aGridFnMaternityChild(table) {
    this.columnDefMaternityChild = [
      ...AgGridFn(table),
    ];
  }

  initGrid() {
    this.columnDefDetail = [
      ...AgGridFn(this.colsDetail.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.deleteDetail.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetMaternityPage.url, ACTIONS.CHI_TIET_THAI_SAN_XOA)
        },
      ]
    }
  }

  deleteDetail(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ matPolicyId: event.rowData.matPolicyId, maternityId: event.rowData.maternityId });
        this.apiService.delMaternityPolicyInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getChiTietForDsThaiSan();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
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
      this.router.navigate(['/nhan-su/thai-san']);
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getMaternityInfo();
    }else {
      this.router.navigate(['/nhan-su/thai-san']);
    }
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
    const queryParams = queryString.stringify({pregnancId : null, maternityId: this.modelEdit.maternityId });
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
    const queryParams = queryString.stringify({childId : null, maternityId: this.modelEdit.maternityId });
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
  isDetailLichThaiSan = false
  listViewsDetail = []
  detailInfoDetail = []
  themMoiChiTietDangKyTS() {
    this.isDetailLichThaiSan = true;
    this.listViewsDetail = []
    this.detailInfoDetail = []
    const queryParams = queryString.stringify( { keyObj: 'maternity_policy_form', maternityId: '' });
    this.apiService.getMaternityInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViewsDetail = [...listViews];
          this.detailInfoDetail = results.data;
          this.getMaternityInfo();
        }
      });
  }

  setMaternityPolicyInfo(data) {
    this.spinner.show();
    const params:any = {
      ...this.detailInfoDetail, group_fields: data, maternityId: this.modelEdit.maternityId
    }
    delete params.data;
    delete params.gridflexdetails1;
    delete params.gridflexdetails2;
    delete params.maternityChild;
    delete params.maternityPregnancy;
    
    this.apiService.setMaternityPolicyInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.isDetailLichThaiSan = false;
          this.dataDetail = []
          this.columnDefDetail = []
          this.getChiTietForDsThaiSan();
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
  closeLichTS(event) {
    this.isDetailLichThaiSan = false
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit()
  }

}

