import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as queryString from 'querystring';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-hrm-search-customer',
  templateUrl: './hrm-search-customer.component.html',
  styleUrls: ['./hrm-search-customer.component.css'],
})
export class HrmSearchCustomerComponent {
  @Input() isSearch: any = false;
  @Output() seachEmValue = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
  ) { }
  searchBy = 'code'
  searchBys = [
    { label: 'Mã Khách hàng', value: 0 },
    { label: 'Số CMT/ HC', value: 1 },
    { label: 'Số điện thoại', value: 2 },
    { label: 'Tên khách hàng', value: 3 },
  ];
  modelStaff = '';
  listStaff = [];
  query = {
    filter: '',
    keyType: '',
    keyName: ''
  }
  isLoading = false;
  dataSearched: any = [];
  dataSearcheSelect: any = [];
  dataInfo: any = null
  custId = '';
  dataInfoCallback: any = []
  isSearching = false
  ngOnInit(): void {

  }

  changeKeyType(event) {

  }

  clearEvent(event) {
    this.modelStaff = '';
  }

  // onSelectStaff(event) {
  //   this.isSearching = false
  //   this.dataSearcheSelect = this.dataSearched.filter( d => event.value === d.custId);
  //   const queryParams = queryString.stringify({ custId: this.dataSearcheSelect[0].custId });
  //   this.custId = this.dataSearcheSelect[0].custId;
  //   this.dataInfoCallback = this.dataSearcheSelect[0]
  //   this.apiService.getEmpProfile(queryParams).subscribe(results => {
  //     if (results.status === 'success') {
  //       this.dataInfo = {
  //         address: getFieldValueAggrid(results.data, 'origin_add'),
  //       }
  //     }
  //   } )
  // }

  // getStaffsAtStore(event = null) {
  //   this.isLoading = true;
  //   this.isSearching = true;
  //   this.apiService.getEmployeePage(queryString.stringify({ filter: this.modelStaff})).subscribe(
  //     (results: any) => {
  //       this.isLoading = false;
  //       this.dataSearched = results.data.dataList.data;
  //       this.listStaff = results.data.dataList.data.map(res => {
  //         return {
  //           label: res.full_name + ' - ' + res.code + ' - ' + res.phone1,
  //           value: res.custId
  //         };
  //       });
  //     })
  // }

  cancelItem() {
    let callbackValue = {
      status: 'cancel',
      value: ''
    }
    this.dataInfo = null
    this.isSearch = false
    this.seachEmValue.emit(callbackValue)
  }

  searchEmp() {
    this.isLoading = true;
    this.isSearching = true;
    this.dataInfo = null;
    this.apiService.getCustSearch(queryString.stringify({ keyName: this.query.keyName,is_worked: 0, keyType: this.query.keyType, offSet: 0, pageSize: 50 })).subscribe((results: any) => {
      this.isLoading = false;
      this.dataSearched = results.data.dataList.data;
    })
  }

  getItem() {
    let callbackValue = {
      status: 'ok',
      value: this.custId,
      dataInfo: this.dataInfo.custId
    }
    if (this.custId) {
      this.seachEmValue.emit(callbackValue);
      this.isSearch = false
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nhân viên' });
    }
  }
  isLoadingInfo = false;
  getEmpInfo(info) {
    this.isLoadingInfo = true;
    this.dataInfo = info;
    // const queryParams = queryString.stringify({ custId: info.custId });
    // this.custId = info.custId;
    // // this.dataInfo = null;
    // this.dataInfoCallback = info.custId
    // this.apiService.getEmpProfile(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.isLoadingInfo = false;
    //     this.dataInfo = {
    //       address: getFieldValueAggrid(results.data, 'origin_add'),
    //       ...info
    //     }
    //   }
    // })
  }

  displayGop = false;
  listTargets_s = [];
  custIdChoosed = [];
  dataCusIdChoosed = [];
  xacnhan() {
    this.modelXacnhan = {
      message: 'Sẽ có một tài khoản bị xóa khỏi danh sách !. Vui lòng xác nhận tài khoản giữ lại.',
      overite: false,
      keep_cif_no: '',
      remove_cif_no: ''
    }
    const selectedRowData = this.dataCusIdChoosed;
    if (selectedRowData.length === 2) {
      this.listTargets_s = selectedRowData.map(d => {
        return { label: d.full_Name + '-' + d.phone1 + '-' + d.idcard_No + '-' + d.cif_No, value: d.cif_No };
      })
      this.modelXacnhan.keep_cif_no = this.listTargets_s[0].value;
      this.modelXacnhan.remove_cif_no = this.listTargets_s[1].value;
      this.displayGop = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chọn 2 tài khoản để gộp' });
      return;
    }
  }
  modelXacnhan = {
    message: 'Sẽ có một tài khoản bị xóa khỏi danh sách !. Vui lòng xác nhận tài khoản sử dụng',
    overite: false,
    keep_cif_no: '',
    remove_cif_no: ''
  }

  checkValue(event, data) {
    this.dataCusIdChoosed = []
    if(event.checked.length > 0){
      this.custIdChoosed.forEach( item => {
        this.dataSearched.forEach(element => {
          if(item === element.custId) {
            this.dataCusIdChoosed.push(element);
          }
        });
      } )
    }
  }

  xacnhangop(overite = false) {
    let params = { ...this.modelXacnhan };
    delete params.message
    this.apiService.setCustMerge(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Gộp tài khoản thành công' });
        this.searchEmp();
        this.displayGop = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        if (results.statusCode === 3) {
          this.modelXacnhan = {
            message: results.message,
            overite: true,
            keep_cif_no: this.modelXacnhan.keep_cif_no,
            remove_cif_no: this.modelXacnhan.remove_cif_no
          }
        }
      }
    })
  }

  changeCifNo(event, type) {
    if (type === 'keep_cif_no') {
      const items = this.listTargets_s.filter(d => d.value !== this.modelXacnhan.keep_cif_no);
      this.modelXacnhan.remove_cif_no = items[0].value;
    } else {
      const items = this.listTargets_s.filter(d => d.value !== this.modelXacnhan.remove_cif_no);
      this.modelXacnhan.keep_cif_no = items[0].value;
    }
  }


}
