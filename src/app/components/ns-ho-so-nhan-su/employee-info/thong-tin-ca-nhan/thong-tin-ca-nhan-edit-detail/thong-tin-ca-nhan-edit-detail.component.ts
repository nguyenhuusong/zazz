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
      { label: '', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
      { label: '', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
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
  getDetail(flow_cur = null) {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true, flow_cur: flow_cur }
    this.apiService.getEmpProfile(queryString.stringify(query)).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur + 1;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);

        this.optionsButtonsView = [
          { label: '', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: '', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  cloneListViews = [];
  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data, flow_cur: event.type === 'Submit' ?  this.flowCurrent : this.flowCurrent -1
    }
     this.cloneListViews = cloneDeep(this.listViews);
    this.listViews = [];
    this.callApiInfo(params, event.type)
  }

  stepActivated(): void {
    console.log(this.flowCurrent)
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.flowCurrent) {
          console.log(i,i<= this.flowCurrent && i !== 0)
          // console.log(i !== 1)
          stepS[i].className +=  ` p-highlight ${i<= this.activeIndex ? 'active' : 'remove-active'} ${i<= this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent
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
        this.flowCurrent = results.data.flow_cur + 1;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.optionsButtonsView = [
          { label: '', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: '', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
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
      this.getDetail(this.flowCurrent === 1 ?this.flowCurrent: this.flowCurrent - 2)
    } else {
      this.cancelSave.emit();
    }
  }
}
