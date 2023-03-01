import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nguoi-duyet',
  templateUrl: './nguoi-duyet.component.html',
  styleUrls: ['./nguoi-duyet.component.scss']
})
export class NguoiDuyetComponent implements OnInit {
  @Input() companyId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';

  modelAuth = {
    auth_id: '',
    companyId: '',
    custId: ''
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_worked`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addComAuth()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getComAuthorizePage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  addComAuth() {
    this.modelAuth = {
      auth_id: '',
      companyId: '',
      custId : ''
    }
    this.isSearchEmp = true;
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getComAuthorizeInfo() {
    const queryParams = queryString.stringify(this.modelAuth);
    this.listViewsDetail = [];
    this.apiService.getComAuthorizeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setDetailInfo(data) {
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.setComAuthorizeInfo(param)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getComAuthorizePage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getComAuthorizePage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ companyId: this.companyId, offSet: 0, pageSize: 10000 });
    this.apiService.getComAuthorizePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.getComAuthorizeInfo();
    }else {
      this.displayFormEditDetail = false;
      this.getComAuthorizePage();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_worked"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.editRow.bind(this),
                label: 'Xem chi tiết',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              
              {
                onClick: this.delRow.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                key: 'delete-qua-trinh-hop-dong',
                class: 'btn-danger',
              },
              {
                onClick: this.defaultAuth.bind(this),
                label: 'Người ký mặc định',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              }
            ]
          };
        },
      }
    ];
  }

  defaultAuth(event) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xác nhận ${event.rowData.authFullName} là người ký mặc định?`,
      accept: () => {
        this.apiService.setCompanyAuthDefault({authId: event.rowData.authid})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xác nhận thành công' });
            this.getComAuthorizePage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  editRow({rowData}) {
    this.modelAuth.auth_id  = rowData.authid
    this.getComAuthorizeInfo();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa ${event.rowData.authFullName} khỏi danh sách người duyệt`,
      accept: () => {
        const queryParams = queryString.stringify({authId: event.rowData.authid});
        this.apiService.delComAuthorizeInfo(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.getComAuthorizePage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }
  isSearchEmp = false;

  seachEmValue(event) {
    if(!event.value) {
      this.isSearchEmp = false;
    }else{
      this.modelAuth = {
        auth_id: '',
        companyId: this.companyId,
        custId : event.custId
      }
      this.getComAuthorizeInfo();
     
    }
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
