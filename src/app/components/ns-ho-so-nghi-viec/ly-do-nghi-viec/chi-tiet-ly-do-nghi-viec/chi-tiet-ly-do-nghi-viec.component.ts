import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-ly-do-nghi-viec',
  templateUrl: './chi-tiet-ly-do-nghi-viec.component.html',
  styleUrls: ['./chi-tiet-ly-do-nghi-viec.component.scss']
})
export class ChiTietLyDoNghiViecComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    {
      label: 'Lưu lại', value: 'Update',
      icon: 'pi pi-check', class: ''
    },
  ];
  @Input() reasonId: any = null;
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';
  detailInfo = null;
  listsData = []
  columnDefs
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  items = [];
  ngOnInit(): void {
    this.manhinh = 'Edit';
    this.getTerminateReasonInfo();
  }

  getTerminateReasonInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({reasonId: this.reasonId});
    this.apiService.getTerminateReasonInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }


  setTerminateReasonInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setTerminateReasonInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
        this.back.emit();
        // this.router.navigate(['/nhan-su/ly-do-nghi-viec']);
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
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
    if (data === 'CauHinh') {
      this.getTerminateReasonInfo();
    } else {
      this.back.emit();
    }
  }

}



