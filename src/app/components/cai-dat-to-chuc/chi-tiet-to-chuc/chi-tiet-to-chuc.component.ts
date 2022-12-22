import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-to-chuc',
  templateUrl: './chi-tiet-to-chuc.component.html',
  styleUrls: ['./chi-tiet-to-chuc.component.scss']
})
export class ChiTietToChucComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Sửa', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT) ? 'hidden' : ''}, 
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary'  }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  orgId = null;
  listViews = [];
  imagesUrl = [];
  paramsObject = null;
  displayUserInfo = false;
  displayModal = false;
  columnDefsGrid = [];
  dataGridAdd = [];
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';
  detailInfo = null;
  listsDataCompanies = [];
  listsDataPositions = [];
  columnDefCompanies = [];
  columnDefPositions = [];
  orgLevels = null;
  @Input() dataRouter = null;
  @Output() back = new EventEmitter<any>();
  items=  [];

  ngOnChanges() {
    // this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
    // this.titlePage = null;
    // this.companyId = this.dataRouter.companyId;
    // this.manhinh = 'Edit';
    // this.getAccountInfo();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.orgId = this.paramsObject.params.orgId;
      this.getOrganizeInfo();
    });
  };

  getOrganizeInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({ orgId: this.orgId });
    this.apiService.getOrganizeInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        // this.orgLevels = this.listViews[0].fields.filter(d => d.field_name === 'org_level')
        // this.listsDataCompanies = [...this.detailInfo.companies]
        // this.listsDataPositions = [...this.detailInfo.positions]
        // this.aGridFnCompanies(this.detailInfo.gridflexdetails2)
        // this.aGridFnPositions(this.detailInfo.gridflexdetails1)
      }
    })
  }

  aGridFnCompanies(table) {
    this.columnDefCompanies = [
      ...AgGridFn(table),
    ];
  }

  aGridFnPositions(table) {
    this.columnDefPositions = [
      ...AgGridFn(table),
    ];
  }
  isPositions = true;
  addCompanies() {
    this.displayModal = true;
    this.dataSelects = cloneDeep(this.listsDataCompanies);
    this.getCompanyList();
    this.isPositions = false;
  }
  dataSelects = []
  addPositions() {
    this.dataSelects = cloneDeep(this.listsDataPositions);
    this.getPositionList();
    this.isPositions = true;
    this.displayModal = true;
  }
  filter = ''
  getCompanyList() {
    const queryParams = queryString.stringify({ filter: this.filter, orgId: this.orgId });
    this.apiService.getCompanyList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.dataGridAdd = results.data;
        const columnDefsGrid = [];
        this.detailInfo.gridflexdetails2.forEach(element => {
          if (element.columnField === 'companyId' || element.columnField === 'companyName'
            || element.columnField === 'address' || element.columnField === 'companyTitle') {
            columnDefsGrid.push(element)
          }
        });
        this.aGridFn(columnDefsGrid);
      }
    })
  }
  aGridFn(table) {
    this.columnDefsGrid = [
      ...AgGridFn(table),
      {
        headerName: 'ALL',
        filter: '',
        width: 80,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
        // cellRendererParams: params => this.showButtons(params),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox',
        suppressSizeToFit: true,
      },
    ];
  }

  find1() {
    if(this.isPositions) {
      this.getPositionList();
    }else {
      this.getCompanyList();
    }
  }
  
  reset() {
    this.filter = '';
    if(this.isPositions) {
      this.getPositionList();
    }else {
      this.getCompanyList();
    }
  }

  getPositionList() {
    const queryParams = queryString.stringify({ orgId: this.orgId, filter: this.filter });
    this.apiService.getPositionList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.dataGridAdd = results.data;
        const columnDefsGrid = [];
        this.detailInfo.gridflexdetails1.forEach(element => {
          if (element.columnField === 'positionId' || element.columnField === 'positionName') {
            columnDefsGrid.push(element)
          }
        });
        this.aGridFn(columnDefsGrid);
      }
    })
  }

  OnClick(event) {

  }

  handleChange(index) {
    this.indexTab = index;
  }

  setOrganizeInfo(data) {
    debugger
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setOrganizeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }


  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getOrganizeInfo();
    }else {
      this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
    }
  }

  submit(datas) {
    if (this.isPositions) {
      const params = {
        orgId: this.detailInfo.orgId,
        positionIds: datas.map(d => d.positionId)
      }
      this.apiService.setOrganizePosition(params).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm chức vụ thành công' });
          this.getOrganizeInfo();
          this.displayModal = false;
        } else {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        }
      })
    } else {
      const params = {
        orgId: this.detailInfo.orgId,
        companyIds: datas.map(d => d.companyId)
      }
      this.apiService.setOrganizeCompany(params).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm công ty thành công' });
          this.getOrganizeInfo();
          this.displayModal = false;
        } else {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        }
      })
    }
  }
}


