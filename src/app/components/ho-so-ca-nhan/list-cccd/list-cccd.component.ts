import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-cccd',
  templateUrl: './list-cccd.component.html',
  styleUrls: ['./list-cccd.component.scss']
})
export class ListCccdComponent implements OnInit {
  @Input() custId = null;
  idcard_no: string = '';
  // optionsButtonsPopup = [
  //   { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  //   { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  // ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData: any[]  = [];
  columnDefs: any[] = [];
  gridKey : string = ''
  displayAddCCCD: boolean = false;
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addCCCD();
        });
      }
    }, 300);
  }

  addCCCD() {
    this.displayAddCCCD = true;
  }

  saveCCCD(event) {
    this.displayAddCCCD =false;
    this.getCustIdentityPage();
  }

  ngOnInit(): void {
    this.getCustIdentityPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
 
  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getCustIdentity() {
    const queryParams = queryString.stringify({ custId: this.custId, idcard_no: this.idcard_no });
    this.listViewsDetail = [];
    this.apiService.getCustIdentity(queryParams)
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
    this.apiService.setEmpWorking(param)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getCustIdentityPage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getCustIdentityPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ custId: this.custId });
    this.apiService.getCustIdentityPage(queryParams)
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
      this.getCustIdentity();
    }else {
      this.displayFormEditDetail = false;
      this.getCustIdentityPage();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
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
                onClick: this.setCustIdentityDefault.bind(this),
                label: 'Sử dụng',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  setCustIdentityDefault({rowData}) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn sử dụng giấy tờ cá nhân này?',
      accept: () => {
        const queryParams = queryString.stringify({ custId: rowData.custId,  idcard_no: rowData.idcard_No, overite: true});
        this.apiService.setCustIdentityDefault(queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa giấy tờ thành công' });
              this.getCustIdentityPage();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
      }
    });
  }

  editRow({rowData}) {
    this.custId = rowData.custId;
    this.idcard_no = rowData.idcard_No;
    this.getCustIdentity();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

}
