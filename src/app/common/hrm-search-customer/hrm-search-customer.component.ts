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
    this.apiService.getCustSearch(queryString.stringify({ keyName: this.query.keyName, keyType: this.query.keyType, offSet: 0, pageSize: 50 })).subscribe((results: any) => {
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


}
