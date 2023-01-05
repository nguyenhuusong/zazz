import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

@Component({
  selector: 'app-cap-nhat-trang-thai-nghi-viec',
  templateUrl: './cap-nhat-trang-thai-nghi-viec.component.html',
  styleUrls: ['./cap-nhat-trang-thai-nghi-viec.component.scss']
})
export class CapNhatTrangThaiNghiViecComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Lưu', value: 'Update',class: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT) ? 'hidden' : '' },
  { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
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

  ngOnChanges() {
  }
  items = [];
  ngOnInit(): void {
    this.getTerminateStatus()
  }


  detailInfo = null;
  getTerminateStatus() {
    this.listViews = [];
    const queryParams = queryString.stringify({terminateId: this.terminateId	});
    this.apiService.getTerminateStatus(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setTerminateStatus(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setTerminateStatus(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.goBack()
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
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
    if(data === 'CauHinh') {
      this.getTerminateStatus();
    }else {
      this.goBack();
    }
  }


}

