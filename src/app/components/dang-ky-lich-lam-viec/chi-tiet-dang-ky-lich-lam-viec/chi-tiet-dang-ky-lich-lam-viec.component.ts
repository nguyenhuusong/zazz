import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { getValueOfField } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-chi-tiet-dang-ky-lich-lam-viec',
  templateUrl: './chi-tiet-dang-ky-lich-lam-viec.component.html',
  styleUrls: ['./chi-tiet-dang-ky-lich-lam-viec.component.scss']
})
export class ChiTietDangKyLichLamViecComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() gd = null;
  @Input() displayFormEditDetail: boolean = false;
  @Input() hideButton: boolean = false;
  tabIndex: number = 0;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButtonsView = [
    { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
    { label: 'Tiếp tục', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Xác nhận', value: 'Submit', class: 'btn-accept', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Close', class: 'btn-accept', icon: 'pi pi-times' }
  ]
  displayuploadcontract = false;
  metafile = null;
  displaySetting = false;
  gridKeyForm = '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  modelEdit = {
    custId: null,
    edit_is: false
  }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    this.getEmpWorking();
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.getEmpWorking()
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getEmpWorking(this.flowCurrent === 1 ? this.flowCurrent : this.flowCurrent - 1)
    } else if (data === 'Close') {
      this.router.navigate(['/tuyen-dung/ds-tuyen-dung'])
    } else {
      this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ho-so-ca-nhan']);
    }
  }

  setSchemeInfo(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent, action: 'next'
    }
    this.cloneListViews = cloneDeep(data);
    this.listViews = [];
    this.callApiInfo(params)

  }
  cloneListViews = []
  callBackForm(event) {
    const params = {
      ...this.detailInfo
      , group_fields: event.data
      , flow_cur: event.type === 'Submit' ? this.flowCurrent : this.flowCurrent
      , action: event.type === 'Submit' ? 'submit' : 'save'
    }
    this.cloneListViews = cloneDeep(event.data);
    this.listViews = [];
    this.callApiInfo(params, event.type);
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setEmpWorking(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          if (type === 'Submit' || type === 'SaveNhap') {
            setTimeout(() => {
              this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ho-so-ca-nhan'])
            }, 200);
          }
        } else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
        this.spinner.hide();
      })
  }
  status = [];
  selectedCountry = [];
  getEmpWorking(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId, gd: this.gd, flow_cur: flow_cur });
    this.apiService.getEmpWorking(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.status = results.data.flowStatuses;
          if (results.data.status) {
            this.status.push(results.data.status);
          }
          this.selectedCountry = results.data.status;
          if (this.detailInfo.actions && this.detailInfo.actions.length > 0) {
            this.initButton();
          }
        } else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      })
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
          this.callActions(item.code);
        }
      }
    });
  }

  callActions(code) {
    console.log(code)
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }



}