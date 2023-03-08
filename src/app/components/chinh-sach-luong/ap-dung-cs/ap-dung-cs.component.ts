import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ap-dung-cs',
  templateUrl: './ap-dung-cs.component.html',
  styleUrls: ['./ap-dung-cs.component.scss']
})
export class ApDungCsComponent implements OnInit {
  @Input() schemeId = null;
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

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_worked`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addUser()
        });
      }
    }, 300);
  }

  addUser() {
    this.displayAddUserByUser = true;
  }
  columnDefs2 = [];
  listsData2 = [];
  getSchemeOpen() {
    this.columnDefs2 = [];
    const queryParams = queryString.stringify({ schemeId: this.schemeId,filter: '' });
    this.apiService.getSchemeOpen(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.gridKey) {
          this.gridKey = repo.data.gridKey;
        }
        this.spinner.hide();
        this.listsData2 = repo.data.dataList || [];
        this.initGrid2(repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  ngOnInit(): void {
    this.getSchemeOpenPage();
    this.getSchemeOpen();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  getComAuthorizeInfo() {
    // const queryParams = queryString.stringify(this.modelAuth);
    // this.listViewsDetail = [];
    // this.apiService.getComAuthorizeInfo(queryParams)
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listViewsDetail = cloneDeep(results.data.group_fields);
    //     this.dataDetailInfo = results.data;
    //     this.displayFormEditDetail = true;
    //   }
    // })
  }


  getSchemeOpenPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ schemeId: this.schemeId, offSet: 0, pageSize: 10000 });
    this.apiService.getSchemeOpenPage(queryParams)
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

  initGrid2(gridflexs) {
    this.columnDefs2 = [
      {
        headerName: '',
        filter: false,
        maxWidth: 50,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: false,
        field: 'checkbox2',
        suppressSizeToFit: false,
        suppressColumnsToolPanel: false,
        // checkboxSelection: (params) => {
        //   return !!params.data && params.data.emp_st === 0;
        // },
        showDisabledCheckboxes: true,
      },
      ...AgGridFn(gridflexs || []),
    ];
  }
  listDataSelect = [];
  rowSelected(data) {
    this.listDataSelect = data
  }

  save() {
    this.spinner.show();
    const params = {
      schemeId: this.schemeId,
      from_date: null,
      to_date: null,
      empIds: this.listDataSelect
    }
    this.apiService.setSchemeOpen(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({
          severity: 'success', summary: 'Thông báo', detail: results.message
        });
        this.displayAddUserByUser = false;
        this.getSchemeOpenPage();
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    })
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
    // this.confirmationService.confirm({
    //   message: `Bạn có chắc chắn muốn xác nhận ${event.rowData.authFullName} là người ký mặc định?`,
    //   accept: () => {
    //     this.apiService.setCompanyAuthDefault({authId: event.rowData.authid})
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe((results: any) => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xác nhận thành công' });
    //         this.getSchemeOpenPage();
    //         this.FnEvent();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  onCellClicked(event) {
    // if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
    //   this.editRow(event = {rowData: event.data})
    // }
  }


  delRow(event) {
    // this.confirmationService.confirm({
    //   message: `Bạn có chắc chắn muốn xóa ${event.rowData.authFullName} khỏi danh sách người duyệt`,
    //   accept: () => {
    //     const queryParams = queryString.stringify({authId: event.rowData.authid});
    //     this.apiService.delComAuthorizeInfo(queryParams)
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe((results: any) => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
    //         this.getSchemeOpenPage();
    //         this.FnEvent();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  displayAddUserByUser= false;

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
