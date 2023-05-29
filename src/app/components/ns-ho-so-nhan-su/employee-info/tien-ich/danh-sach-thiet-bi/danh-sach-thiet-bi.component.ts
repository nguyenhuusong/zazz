
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-danh-sach-thiet-bi',
  templateUrl: './danh-sach-thiet-bi.component.html',
  styleUrls: ['./danh-sach-thiet-bi.component.scss']
})
export class DanhSachThietBiComponent implements OnInit {
  @Input() empId = null;
  optionsButtonsPopup = []
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = ''

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chức năng đang phát triển' });
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getEmpDeviceByEmp();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  id = null
  addTimeWork() {
    this.id = null
    this.getEmpDevice();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpDevice() {
    const queryParams = queryString.stringify({ empId: this.empId, Id: this.id });
    this.listViewsDetail = [];
    this.apiService.getEmpDevice(queryParams)
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
        this.getEmpDeviceByEmp();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getEmpDeviceByEmp() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpDeviceByEmp(queryParams)
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
      this.getEmpDevice();
    }else {
      this.displayFormEditDetail = false;
      this.getEmpDeviceByEmp();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        // headerComponentParams: {
        //   template:
        //   `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        // },
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
                onClick: this.SetEmpDeviceStatus.bind(this),
                label: 'Phê duyệt',
                icon: 'pi pi-check',
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
            ]
          };
        },
      }
    ];
  }

  editRow({rowData}) {
    // this.messageService.add({ severity: 'war', summary: 'Thông báo', detail: 'Chức năng đang phát triển' });
    this.id = rowData.id;
    this.getEmpDevice();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa?',
      accept: () => {
        const queryParams = queryString.stringify({device_id: event.rowData.device_id});
        this.apiService.delEmpDevices(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.getEmpDeviceByEmp();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  SetEmpDeviceStatus(event) {
    this.confirmationService.confirm({
      message: 'Bạn chắc chắn muốn phê duyệt bản ghi này?',
      accept: () => {
        this.apiService.setEmpDeviceStatus({device_id: event.rowData.device_id, request_st: 1})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Duyệt thành công' });
            this.getEmpDeviceByEmp();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}
