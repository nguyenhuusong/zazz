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
    { label: 'Lưu lại', value: 'Update', icon: 'pi pi-check', class: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT) ? 'hidden' : ''}, 
    { label: 'Quay lại', value: 'Back', icon: 'pi pi-times', class: 'p-button-secondary'  }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  @Input() orgId = null;
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
  }

  ngOnInit(): void {
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.orgId = this.paramsObject.params.orgId || null;
      if(this.orgId) {
        this.titlePage = this.activatedRoute.data['_value'].title;
        this.items = [
          { label: 'Trang chủ' , routerLink: '/home' },
          { label: 'Cài đặt' },
          { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
          { label: `${this.titlePage}` },
        ];
        this.url = this.activatedRoute.data['_value'].url;
      }
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
  
  setOrganizeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setOrganizeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if(this.orgId) {
          this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
        }else {
          this.back.emit();
        }
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
      if(this.orgId) {
        this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
      }else {
        this.back.emit();
      }
    }
  }

}


