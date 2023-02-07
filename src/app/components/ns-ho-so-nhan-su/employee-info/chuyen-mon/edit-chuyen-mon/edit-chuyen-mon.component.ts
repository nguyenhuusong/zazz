import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-edit-chuyen-mon',
  templateUrl: './edit-chuyen-mon.component.html',
  styleUrls: ['./edit-chuyen-mon.component.scss']
})
export class EditChuyenMonComponent implements OnInit {
  @Input() empId = null;
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
  activeIndex = 0;
  steps = [];
  getDetail() {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true }
    this.apiService.getEmpQualification(queryString.stringify(query)).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        // this.activeIndex = results.data.flow_st;
        // this.steps = results.data.flowStatuses.map(d => {
        //   return {
        //     label: d.flow_name,
        //     value: d.flow_st
        //   }
        // });
        // setTimeout(() => {
        //   this.stepActivated();
        // }, 100);
        // if(results.data.submit_st) {
        //   this.optionsButtonsView = [
        //     { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //     { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
        //   ]
        // }else {
        //   if(results.data.save_st) {
        //     this.optionsButtonsView = [
        //       { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel': 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   }else {
        //     this.optionsButtonsView = [
        //       { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel': 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   }
       
        // }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }


  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data, flow_st: event.type === 'Submit' ?  this.activeIndex + 1 : this.activeIndex
    }
    this.callApiInfo(params)
    if(event.type === 'Submit' || event.type === 'SaveNhap') {
      setTimeout(() => {
        this.cancelSave.emit();
      }, 200);
    }
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.activeIndex) {
          stepS[i].className += ' active';
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.callApiInfo(params)
  
  }

  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setEmpQualification(params).subscribe((results: any) => {
      if (results.status === 'success') {
        // this.listViews = cloneDeep(results.data.group_fields || []);
        // this.detailInfo = results.data;
        // this.activeIndex = results.data.flow_st;
        // this.steps = results.data.flowStatuses.map(d => {
        //   return {
        //     label: d.flow_name,
        //     value: d.flow_st
        //   }
        // });
        // setTimeout(() => {
        //   this.stepActivated();
        // }, 100);
        // if(results.data.submit_st) {
        //   this.optionsButtonsView = [
        //     { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //     { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
        //   ]
        // }else {
        //   if(results.data.save_st) {
        //     this.optionsButtonsView = [
        //       { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Lưu tạm', value: 'Update', class: 'btn-accept' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   }else {
        //     this.optionsButtonsView = [
        //       { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
        //       { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
        //     ]
        //   }
       
        // }
        this.spinner.hide();
        this.cancelSave.emit();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
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

