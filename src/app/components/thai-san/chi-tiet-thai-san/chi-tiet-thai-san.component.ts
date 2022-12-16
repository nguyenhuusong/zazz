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
  heightGrid = 300;
  organIdSelected = '';
  emId = '';
  emDataInfo = []
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
        this.modelEdit.maternityId = this.paramsObject.params.maternityId || null;
        this.emId = this.paramsObject.params.emId || null;
        this.getMaternityInfo();
      });
  };

  getChiTietForDsThaiSan() {
    
    this.columnDefDetail = []
    this.dataDetail = []
    this.colsDetail = [];
    this.modelEdit.keyObj = '';
    this.listsDataMaternityPregnancy = [];
    this.columnDefMaternityPregnancy = [];
    this.columnDefKhamThai = []
    this.columnDefConnho = []
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getMaternityInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          if(results.data.gridflexs){
            this.colsDetail = results.data.gridflexs;
          }
          this.dataDetail = results.data.data;
          this.columnDefMaternityChild = results.data.gridflexdetails1 || []
          this.columnDefMaternityPregnancy = results.data.gridflexdetails2 || []
          this.listsDataMaternityPregnancy = results.data.maternityPregnancy
          this.listsDataMaternityChild = results.data.maternityChild
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
          this.listViews = setOrganizeId(this.listViews, 'org_cds', this.organIdSelected );
          this.detailInfo = results.data;
          // this.listsDataMaternityPregnancy = [...this.detailInfo.maternityPregnancy || []]
          // this.listsDataMaternityChild = [...this.detailInfo.maternityChild || []]
          // this.aGridFnMaternityChild(this.detailInfo.gridflexdetails1 || [])
          // this.aGridFnMaternityPregnancy(this.detailInfo.gridflexdetails2 || []);
          // if(results.data.gridflexs){
          //   this.colsDetail = results.data.gridflexs;
          // }
          this.columnDefMaternityChild = results.data.gridflexdetails1 || []
          this.columnDefMaternityPregnancy = results.data.gridflexdetails2 || []
          this.listsDataMaternityPregnancy = results.data.maternityPregnancy
          this.listsDataMaternityChild = results.data.maternityChild
          this.initGrid();
          this.dataDetail = results.data.data;

          // this.initGrid();
        }
        // set by emid
        if(this.emId) {
          let listViews = cloneDeep(this.listViews);
          this.listViews = []
          const queryParams = queryString.stringify({ empId: this.emId });
          this.apiService.getEmpWorkJob(queryParams).subscribe(results => {
  
            let companyValue = getValueOfField(results.data.group_fields, 'companyId');
            let orgcdsValue = getValueOfField(listViews, 'org_cds');
            if (results.status === 'success') {
              this.emDataInfo = results.data;
              listViews.forEach( group => {
                group.fields.forEach(field => {
                  if(field.field_name === 'companyName') { 
                    field.columnValue = companyValue;
                  }else if(field.field_name === 'empId') { 
                    field.columnObject = field.columnObject + '&organizeId=' + orgcdsValue + '&ftUserId=' + this.emId
                    field.columnValue = this.emId;
                  }
                });
              })
            }
            this.listViews = [...listViews];
          } )
        }
      });
  }

  columnDefKhamThai = []
  columnDefConnho = []

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
      }
    ]
      
    this.columnDefKhamThai = [
      ...AgGridFn(this.columnDefMaternityChild.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtonsKhamThai(params),
        checkboxSelection: false,
        field: 'checkbox'
      }
    ]

    this.columnDefConnho = [
      ...AgGridFn(this.columnDefMaternityPregnancy.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtonsConnho(params),
        checkboxSelection: false,
        field: 'checkbox'
      }
    ]
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

  showButtonsKhamThai(event) {
    return {
      buttons: [
        {
          onClick: this.deleteKhamThai.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetMaternityPage.url, ACTIONS.CHI_TIET_THAI_SAN_KHAM_THAI_XOA)
        },
      ]
    }
  }

  showButtonsConnho(event) {
    return {
      buttons: [
        {
          onClick: this.deleteConNho.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetMaternityPage.url, ACTIONS.CHI_TIET_THAI_SAN_CON_NHO_XOA)
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

  deleteConNho(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ childId: event.rowData.childId });
        this.apiService.delMaternityChildInfo(queryParams).subscribe(results => {
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

  deleteKhamThai(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({ pregnancyId: event.rowData.pregnancyId });
        this.apiService.delMaternityPregnancyInfo(queryParams).subscribe(results => {
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
    let groupFieldNew = event;
    groupFieldNew[0].fields.forEach(element => {
      if(element.field_name === "meta_file_name") {
        element.columnValue = this.fileThaiSan.name;
      }else if(element.field_name === "meta_file_type") {
        element.columnValue = this.fileThaiSan.type;
      }else if(element.field_name === "meta_title") {
        element.columnValue = "File dữ liệu khám thai";
      }else if(element.field_name === "meta_file_size") {
        element.columnValue = this.fileThaiSan.size;
      }
    });
    const params = {
      ...this.detailInfo_other, group_fields: groupFieldNew
    }
    this.apiService.setMaternityPregnancyInfo(this.modelAdd.set,params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.displayAddThaiSan = false;
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
  fileThaiSan: any = []
  getFileInfo(data) {
    this.fileThaiSan = data[0]
  }

  cellClicked(data) {
    if(data.colDef.field === "meta_file_name") {
      var url = data.data.link_view;
      var elem = document.createElement('a');
      elem.href = data.data.meta_file_url;
      elem.target = 'hiddenIframe';
      elem.click();
    }
  }

}

