import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-thong-tin-ca-nhan-edit-detail',
  templateUrl: './thong-tin-ca-nhan-edit-detail.component.html',
  styleUrls: ['./thong-tin-ca-nhan-edit-detail.component.scss']
})
export class ThongTinCaNhanEditDetailComponent implements OnInit {
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
      { label: 'Lưu tạm', value: 'Update', class: 'btn-accept' },
      { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }
  activeIndex = 0;
  steps = [];
  getDetail(flow_st = null) {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true, flow_st: flow_st }
    this.apiService.getEmpProfile(queryString.stringify(query)).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.activeIndex = results.data.flow_st;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        if(results.data.submit_st) {
          this.optionsButtonsView = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
          ]
        }else {
          if(results.data.save_st) {
            this.optionsButtonsView = [
              { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel': 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }else {
            this.optionsButtonsView = [
              { label: results.data.flow_st === 0 ? 'Hủy' : 'Quay lại', value: results.data.flow_st === 0 ? 'Cancel': 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }
       
        }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  cloneListViews = [];
  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data, flow_st: event.type === 'Submit' ?  this.activeIndex + 1 : this.activeIndex
    }
     this.cloneListViews = cloneDeep(this.listViews);
    this.listViews = [];
    this.callApiInfo(params, event.type)
   
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
      ...this.detailInfo, group_fields: data, flow_st: this.activeIndex + 1
    };
    this.cloneListViews = cloneDeep(this.listViews);
    this.listViews = [];
    this.callApiInfo(params)
  
  }

  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setEmpProfile(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.activeIndex = results.data.flow_st;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        if(results.data.submit_st) {
          this.optionsButtonsView = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Trình duyệt', value: 'Submit', class: 'btn-accept' }
          ]
        }else {
          if(results.data.save_st) {
            this.optionsButtonsView = [
              { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Lưu tạm', value: 'Update', class: 'btn-accept' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }else {
            this.optionsButtonsView = [
              { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
              { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
            ]
          }
       
        }
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thông tin thành công' });
        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.cancelSave.emit();
          }, 200);
        }
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
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
      this.getDetail(this.activeIndex - 1)
    } else {
      this.cancelSave.emit();
    }
  }
}
