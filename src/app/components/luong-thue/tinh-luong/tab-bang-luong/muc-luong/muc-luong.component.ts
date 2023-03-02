import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-muc-luong',
  templateUrl: './muc-luong.component.html',
  styleUrls: ['./muc-luong.component.scss']
})
export class MucLuongComponent implements OnInit {
  detailInfo = null
  listViews = [];
  @Input() baseId = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
  ];
  displaySetting =false;
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  cauhinh() {
    this.displaySetting = true;
  }

  ngOnInit(): void {
    this.getPayrollRankPage()
  }
  columnDefs = [];
  listsData = [];
  gridKey="";
  gridflexs = [];
  getPayrollRankPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ baseId: this.baseId, offSet: 0, pageSize: 10000 });
    this.apiService.getPayrollRankPage(queryParams)
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
    this.getPayrollRankInfo()
  }
  
  addPayroll() {
    this.IdDetail = null;
    this.getPayrollRankInfo()
  }

  getPayrollRankInfo() {
    this.listViewsDetail = [];
    const queryParams = queryString.stringify({id: this.IdDetail, baseId: this.baseId });
    this.apiService.getPayrollRankInfo(queryParams)
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
        const query = queryString.stringify({id	: event.rowData.id	})
        this.apiService.delPayrollRank(query)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công' });
            this.getPayrollRankPage();
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
    this.apiService.setPayrollRankInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.isFormDetail = false;
          this.getPayrollRankPage();
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
      this.getPayrollRankInfo();
    }else {
      this.isFormDetail = false;
    }
  }


}
