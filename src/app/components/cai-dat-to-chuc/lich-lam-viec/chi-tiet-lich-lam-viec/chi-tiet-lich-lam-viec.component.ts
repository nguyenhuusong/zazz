import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-lich-lam-viec',
  templateUrl: './chi-tiet-lich-lam-viec.component.html',
  styleUrls: ['./chi-tiet-lich-lam-viec.component.scss']
})
export class ChiTietLichLamViecComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetWorktimePage.url, ACTIONS.EDIT) ? 'hidden' : ''},
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  work_cd = null
  org_level = 0
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';
  columnDefs = [];
  defaultColDef: any = {
    editable: false,
    tooltipComponent: 'customTooltip',
    resizable: true,
    filter: '',
    cellClass: ['border-right'],
  };
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();
  items = [];

  ngOnChanges() {

  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
      { label: 'Danh sách lịch làm việc', routerLink: '/cai-dat/lich-lam-viec' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();
  }
  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.work_cd = this.paramsObject.params.work_cd || 0;
      this.getWorktimeInfo();
    });
  };

  detailInfo = null;
  getWorktimeInfo() {
    this.listViews = [];
    this.columnDefs = [];
    const queryParams = queryString.stringify({ work_cd: this.work_cd });
    this.apiService.getWorktimeInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        let gridflexs1 = cloneDeep(this.detailInfo.gridflexs1);
        if (this.manhinh === 'Edit') {
          gridflexs1.forEach(d => {
            if (d.columnField !== 'work_status') {
              d.cellClass = [...d.cellClass, 'bg-f7ff7']
              d.editable = true;
            }
          });
        }
        this.columnDefs = [...AgGridFn(gridflexs1 || []),];
      }
    })
  }


  handleChange(index) {
    this.indexTab = index;
  }

  setWorkTimeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setWorktimeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.goBack()
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
    } else {
      this.defaultColDef = {
        editable: true,
        tooltipComponent: 'customTooltip',
        resizable: true,
        filter: '',
        cellClass: ['border-right'],
      };
      this.getWorktimeInfo();
    }
  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/cai-dat/lich-lam-viec']);
    } else {
      this.back.emit();
    }
  }

  OnClick(e) {
  }
  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getWorktimeInfo();
    }else {
      this.goBack();
    }
  }

}




