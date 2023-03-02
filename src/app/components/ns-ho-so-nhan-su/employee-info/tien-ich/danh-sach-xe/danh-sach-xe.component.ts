import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-danh-sach-xe',
  templateUrl: './danh-sach-xe.component.html',
  styleUrls: ['./danh-sach-xe.component.scss']
})
export class DanhSachXeComponent implements OnInit {
  @Input() empId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private router: Router,
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
    this.getEmpVehiclePageByEmp();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  cardVehicleId = null
  addTimeWork() {
    this.cardVehicleId = null
    this.getEmpVehicleInfo();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpVehicleInfo() {
    const queryParams = queryString.stringify({ empId: this.empId, cardVehicleId: this.cardVehicleId });
    this.listViewsDetail = [];
    this.apiService.getEmpVehicleInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setEmployeeVehicleInfo(data) {
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.setEmployeeVehicleInfo(param)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getEmpVehiclePageByEmp();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getEmpVehiclePageByEmp() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000, status: -1 });
    this.apiService.getEmpVehiclePageByEmp(queryParams)
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
      this.getEmpVehicleInfo();
    }else {
      this.displayFormEditDetail = false;
      this.getEmpVehiclePageByEmp();
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
                onClick: this.addVehicleApprove.bind(this),
                label: 'Phê duyệt',
                icon: 'fa fa-thumbs-up',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.editRow.bind(this),
                label: 'Xem chi tiết',
                icon: 'fa fa-edit',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.delRow.bind(this),
                label: 'Xóa xe',
                icon: 'pi pi-trash',
                class: 'btn-danger mr5',
              },
              {
                onClick: this.lockCardVehicle.bind(this),
                label: 'Khóa',
                icon: 'fa fa-lock',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.unlockCardVehicle.bind(this),
                label: 'Mở khóa',
                icon: 'fa fa-unlock',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  show = false;
  modelApprove = {
    cardVehicleId: 0,
    cardCd: null,
    endTime: null
  }
  displayVehicleApprove = false;
  checkEnddate(isSend): void {
    this.show = !isSend;
    if (this.show === false) {
      this.modelApprove.endTime = '';
    } else {
      this.modelApprove.endTime = new Date('01/01/2030');
    }
  }

  addVehicleApprove(event): void {
    this.modelApprove.cardCd = '';
    this.modelApprove.cardVehicleId = event.rowData.cardVehicleId;
    this.modelApprove.endTime = new Date();
    this.displayVehicleApprove = true;
  }

  SaveVehicleApprove(): void {
    const dataSave = { cardVehicleId: this.modelApprove.cardVehicleId, cardCd: this.modelApprove.cardCd, endTime: '' };
    if (this.show) {
      dataSave.endTime = this.datetostring(this.modelApprove.endTime);
    }
    this.apiService.setVehicleApprove(dataSave)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response: any) => {
        if (response.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Phê duyệt vé xe thành công' });
          this.displayVehicleApprove = false;
          this.getEmpVehiclePageByEmp();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message || 'Phê duyệt vé xe thất bại' });
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Phê duyệt vé xe thất bại' });
        console.error(error);
      });
  }

  lockCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Khóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.lockCardVehicle(event.rowData.cardVehicleId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results : any) => {
            if(results.status === 'success') {
              this.getEmpVehiclePageByEmp();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa dịch vụ gửi xe thành công' });
            }else {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            }
          }, error => this.handlerError(error));
      }
    });
  }

  approveCardVehicle(event): void {
    this.apiService.approveCardVehicle(event.rowData.cardVehicleId).then((results: any) => {
      if(results.status === 'success') {
        this.getEmpVehiclePageByEmp();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thành công' });
      }else {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      }
    }, error => this.handlerError(error));
  }

  unlockCardVehicle(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.unlockCardVehicle(event.rowData.cardVehicleId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results: any) => {
            if(results.status === 'success') {
              this.getEmpVehiclePageByEmp();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa dịch vụ gửi xe thành công' });
            }else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
            }
           
          }, error => this.handlerError(error));
      }
    });

  }

  delRow(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa dịch vụ gửi xe này?',
      accept: () => {
        this.apiService.setVehicleRemove({ cardVehicleId: event.rowData.cardVehicleId })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => {
            if (response.status === 'success') {
              this.getEmpVehiclePageByEmp();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xóa dịch vụ xe thành công' });
            } else {
              this.messageService.add({
                severity: 'error', summary: 'Thông báo',
                detail: response.message || 'Xóa dịch vụ gửi xe thất bại'
              });
            }
          }, error => {
            this.handlerError(error);
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xóa dịch vụ gửi xe thất bại' });
          });
      }
    });
  }

  datetostring(date): string {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
  }

  handlerError(error): void {
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
  }


  editRow({rowData}) {
    this.cardVehicleId = rowData.cardVehicleId;
    this.getEmpVehicleInfo();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

}
