import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-ds-chi-tiet-luong',
  templateUrl: './ds-chi-tiet-luong.component.html',
  styleUrls: ['./ds-chi-tiet-luong.component.scss']
})
export class DsChiTietLuongComponent implements OnInit {
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
  displaySetting= false;
  gridKeyForm= '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  modelEdit = {
    recordId: null,
    record_st: 0
  };
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách tiền lương', routerLink: '/chinh-sach/tien-luong' },
      { label: `${this.titlePage}` },
    ]
    this.handleParams();
  }
  paramsObject = null;

  handleParams(): void {
    console.log("sdas")
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.recordId = this.paramsObject.params.recordId || null
      this.getSalaryRecordInfo();
    });
  }
  indexTab = 0;
  handleChange(index) {
    this.indexTab = index;
  }

 
  cancel(data) {
    if (data === 'CauHinh') {
      this.getSalaryRecordInfo() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getSalaryRecordInfo(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else {
      this.router.navigate(['/chinh-sach/tien-luong'])
    }
  }

  onBack() {
    this.router.navigate(['/chinh-sach/tien-luong'])
  }

  setTerminateInfo(data) {
      const params = {
        ...this.detailInfo, group_fields: data.datas
      }
      this.callApiInfo(params)
  }

  cloneListViews = []
  callBackForm(event) {
    const params = {
      ...this.detailInfo
      , group_fields: event.data
    }
    this.callApiInfo(params, event.type);
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setSalaryRecordInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        setTimeout(() => {
          this.router.navigate(['/chinh-sach/tien-luong'])
        }, 200);
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
  selectedStatus = null;
  getSalaryRecordInfo(flow_cur = null) {
    this.detailInfo = null;
      this.listViews = [];
      this.spinner.show();
      const queryParams = queryString.stringify({ recordId: this.modelEdit.recordId });
      this.apiService.getSalaryWorkStatus(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.modelEdit.recordId = results.data.recordId;
          this.detailInfo = results.data;
          this.listViews = cloneDeep(results.data.group_fields);
          this.status = results.data.flowStatuses || [];
          if(results.data.status) {
            this.status.push(results.data.status);
          }
          this.selectedStatus = results.data.status;
          if( this.detailInfo.actions) {
             this.initButton();
          }
          this.spinner.hide();
        }else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
          this.router.navigate(['/chinh-sach/tien-luong'])
        }
      })
   
  }


  UpdateStatus() {
    this.getSalaryRecordInfo(this.selectedStatus.value);
  }
  menuActions = []

  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

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



}

  
  


