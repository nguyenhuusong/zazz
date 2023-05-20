import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-thong-tin-ca-nhan-edit-detail',
  templateUrl: './thong-tin-ca-nhan-edit-detail.component.html',
  styleUrls: ['./thong-tin-ca-nhan-edit-detail.component.scss']
})
export class ThongTinCaNhanEditDetailComponent implements OnInit {
  @Input() empId = null;
  @Input() isEditDetail = false;
  @Output() cancelSave = new EventEmitter<any>();
  detailInfo = null;
  listViews = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    ) { }
   optionsButtonsView = [
      { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
      { label: 'Tiếp tục', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
      { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept', icon: 'pi pi-caret-right' },
      { label: 'Xác nhận', value: 'Submit', class: 'btn-accept', icon: 'pi pi-check' },
      { label: 'Đóng', value: 'Close', class: 'btn-accept', icon: 'pi pi-times' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }
  activeIndex = 0;
  flowCurrent = 0;
  steps = [];

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  status = [];
  selectedStatus = null;
  getDetail(flow_cur = null) {
    this.spinner.show();
    this.listViews = [];
    const query = { empId: this.empId, edit_is: true, flow_cur: flow_cur }
    this.apiService.getEmpProfile(queryString.stringify(query))
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
        this.initButton();
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

  cloneListViews = [];
  callBackForm(event) {
   
  }

  setDetail(data) {
    const params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.spinner.show();
    this.apiService.setEmpProfile(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thông tin thành công' });
        if(data.event === 'actSubmit') {
          setTimeout(() => {
            this.cancelSave.emit();
          }, 200);
        }
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
      this.getDetail(this.flowCurrent === 1 ?this.flowCurrent: this.flowCurrent - 2)
    } else {
      this.cancelSave.emit();
    }
  }
}
