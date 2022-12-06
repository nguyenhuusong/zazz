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
      { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
      { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }

  getDetail() {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true }
    this.apiService.getEmpProfile(queryString.stringify(query)).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        if(results.data.submit_st) {
          this.optionsButtonsView = [
            { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Trình duyệt', value: 'Update', class: 'btn-accept' }
          ]
        }else {
          this.optionsButtonsView = [
            { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
          ]
        }
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpProfile(params).subscribe((results: any) => {
      if (results.status === 'success') {
      
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  canceDetail(event) {
    if(event === 'Cancel') {
      this.cancelSave.emit(true)
    }
  }

}
