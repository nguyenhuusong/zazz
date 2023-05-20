import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chi-tiet-thoi-gian-lam-viec',
  templateUrl: './chi-tiet-thoi-gian-lam-viec.component.html',
  styleUrls: ['./chi-tiet-thoi-gian-lam-viec.component.scss']
})
export class ChiTietThoiGianLamViecComponent implements OnInit {
  @Input() empId = null;
  @Input() workingId = null;
  @Input() displayFormEditDetail: boolean = false;
  @Output() cancelSave = new EventEmitter<any>();
  detailInfo = null;
  listViews = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    ) { }
    optionsButtonsView = [
      { label: 'Bỏ qua', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
      { label: 'Xác nhận', value: 'Update', class: 'btn-accept' },
      // { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  activeIndex = 0;
  steps = [];
  selectedStatus = null;
  status = [];
  getDetail(flow_st = null) {
    this.spinner.show();
    this.detailInfo = null;
    this.listViews = [];
    const query = { empId: this.empId, id: this.workingId, flow_st: flow_st }
    this.apiService.getEmpWorking(queryString.stringify(query))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if(this.detailInfo.actions &&this.detailInfo.actions.length > 0) {
          this.initButton();
        }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  UpdateStatus() {
    this.getDetail(this.selectedStatus.value);
  }
  
  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

  menuActions = [];
  initButton() {
    this.optionsButtonsView = this.detailInfo.actions.map(item => {
      return {
        label: item.name,
        value: item.code,
        icon: item.icon
      }
    });

    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this[item.code]();
        }
      }
    });
  }

  cloneListViewsDetail = [];
  callBackForm(event: any) {
    const params = {
      ...this.detailInfo
      , group_fields: event.data
    }
    this.cloneListViewsDetail = cloneDeep(event.data)
    this.listViews = [];
    this.callApiInfo(params, event.type)
  }

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.callApiInfo(params)
  }

  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setEmpWorking(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.damessageta ? results.message : 'Cập nhật thông tin thành công' });
        this.cancelSave.emit();
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  canceDetail(data) {
    if (data === 'CauHinh') {
      this.getDetail()
    } else if (data === 'BackPage') {
      this.listViews = [];
      const params = {
        ...this.detailInfo, flow_st: this.activeIndex - 1
      }
      this.callApiInfo(params)
    } else {
      this.cancelSave.emit();
    }
  }
}
