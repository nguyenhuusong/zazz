import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cap-nhat-trang-thai-nghi-viec',
  templateUrl: './cap-nhat-trang-thai-nghi-viec.component.html',
  styleUrls: ['./cap-nhat-trang-thai-nghi-viec.component.scss']
})
export class CapNhatTrangThaiNghiViecComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Lưu', value: 'Update',icon: 'pi pi-check', class: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT) ? 'hidden' : '' },
  { label: 'Đóng', value: 'Back',icon: 'pi pi-times', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  positionTitleId = null
  organizeId = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage : string = '';
  url: string = '';

  @Input() terminateId = null
  @Output() back = new EventEmitter<any>();

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {}
  items = [];
  ngOnInit(): void {
    this.getTerminateStatus()
  }


  detailInfo = null;
  getTerminateStatus() {
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({terminateId: this.terminateId	});
    this.apiService.getTerminateStatus(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
      }else {
        this.spinner.hide();
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setTerminateStatus(data) {
    this.spinner.show();
    const formData = new FormData();
    formData.append('terminateId',this.terminateId ? `${this.terminateId}` : '');
    formData.append('group_fields', `${JSON.stringify(data)}`);
    console.log('this.detailInfo.formFile', this.detailInfo.formFile)
    formData.append('formFile', (this.detailInfo.formFile && this.detailInfo.formFile.length > 0) ? this.detailInfo.formFile[0] : '');
    this.apiService.setTerminateStatus(formData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.goBack()
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.spinner.hide();
      }
    }, error => {
    });
  }

  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setTerminateStatusDraft(params);
    } 
  }

  
  setTerminateStatusDraft(params: any) {
    this.spinner.show();
    this.apiService.setTerminateStatusDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.spinner.hide();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
            this.spinner.hide();
        }
      }), error => {
      };
  }



  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
    this.back.emit();
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getTerminateStatus();
    }else {
      this.goBack();
    }
  }


}


