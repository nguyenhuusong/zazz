import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-edit-chuyen-mon',
  templateUrl: './edit-chuyen-mon.component.html',
  styleUrls: ['./edit-chuyen-mon.component.scss']
})
export class EditChuyenMonComponent implements OnInit {
  @Input() empId = null;
  @Input() isEditDetail: boolean = false;
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getDetail();
  }

  UpdateStatus() {
    this.getDetail();
  }
  activeIndex = 0;
  steps = [];
  status = [];
  selectedStatus = null;
  getDetail() {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true }
    this.apiService.getEmpQualification(queryString.stringify(query))
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
        if(this.detailInfo.actions && this.detailInfo.actions.length > 0) {
          this.initButton();
        }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  optionsButon = [];
  menuActions = [];
  initButton() {
    this.optionsButon = this.detailInfo.actions.map(item => {
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
          this.callActions(item.code);
        }
      }
    });
  }

 callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

  actSave(data) {
    const  params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.callApiInfo(params)
  }

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.callApiInfo(params)
  
  }

  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setEmpQualification(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
       
        this.spinner.hide();
        this.cancelSave.emit();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data.messages ? results.data.messages : 'Cập nhật thông tin thành công' });
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.data
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

