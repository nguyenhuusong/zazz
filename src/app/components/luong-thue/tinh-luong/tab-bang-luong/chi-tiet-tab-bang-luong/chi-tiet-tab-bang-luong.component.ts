import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-tab-bang-luong',
  templateUrl: './chi-tiet-tab-bang-luong.component.html',
  styleUrls: ['./chi-tiet-tab-bang-luong.component.scss']
})
export class ChiTietTabBangLuongComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.EDIT_TINH_LUONG_BANG_LUONG) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
  titlePage = '';
  @Input() idForm: any = null;
  @Output() detailOut = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail() {
    const queryParams = queryString.stringify({Id: this.idForm });
    this.apiService.getPayrollInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = cloneDeep(listViews);
          this.detailInfo = results.data;
        }
      });
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getDetail();
    }else {
      this.detailOut.emit();
    }
  }

  handleSave(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event
    };
    this.apiService.setPayrollInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.detailOut.emit();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      };
  }

  tabIndex = 0;
  columnDefs = [];
  listsData = []
  handleChange(e){
    this.tabIndex = e;
    if(e=== 1) {
      this.getPayrollComponentPage()
    }
  }
  gridflexs = [];
  gridKey = '';
  displaySetting = false;
  cauhinh() {
      this.displaySetting = true;
  }

  getPayrollComponentPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ appInfoId: this.idForm, offSet: 0, pageSize: 10000 });
    this.apiService.getPayrollComponentPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        this.listsData = repo.data.dataList.data;
        this.gridflexs = repo.data.gridflexs;
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey
        }
        this.spinner.hide();
        this.initGrid();
      } else {
        this.spinner.hide();
      }
    })
  }
  
  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 100,
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
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.VIEW_TINH_LUONG_BANG_LUONG)
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_BANG_LUONG)
        },
      ]
    };
  }
  isFormDetail = false;
  IdDetail = null
  editRow(event) {
    this.IdDetail = event.rowData.id;
    this.getPayrollComponentInfo()
  }

  addPayroll() {
    this.IdDetail = null;
    this.getPayrollComponentInfo()
  }

  getPayrollComponentInfo() {
    this.listViewsDetail = [];
    const queryParams = queryString.stringify({Id: this.IdDetail, appInfoId: this.idForm });
    this.apiService.getPayrollComponentInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViewsDetail = cloneDeep(listViews);
          this.detailInfoDetail = results.data;
          this.isFormDetail = true;
        }
      });
  }

  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa',
      accept: () => {
        const query = queryString.stringify({Id: event.rowData.id})
        this.apiService.delPayrollComponent(query)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công' });
            this.getPayrollComponentPage();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  listViewsDetail = [];
  detailInfoDetail = null;
  handleSaveTab1(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfoDetail, group_fields: event
    };
    this.apiService.setPayrollComponentInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.isFormDetail = false;
          this.getPayrollComponentPage();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      };
  }

  quaylaiDetail(data) {
    if(data === 'CauHinh') {
      this.getPayrollComponentInfo();
    }else {
      this.isFormDetail = false;
    }
  }


}

