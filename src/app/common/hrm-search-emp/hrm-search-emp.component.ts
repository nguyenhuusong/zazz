import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as queryString from 'querystring';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { getFieldValueAggrid } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-hrm-search-emp',
  templateUrl: './hrm-search-emp.component.html',
  styleUrls: ['./hrm-search-emp.component.css'],
})
export class HrmSearchEmpComponent {
  @Input() isSearch: any = false;
  @Input() sex: any = null;
  @Output() seachEmValue = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
  ) { }
  searchBy = 'code'
  searchBys: any = [
    {
      label: 'Mã nhân viên',
      value: 1
    },
    {
      label: 'Họ tên',
      value: 2
    },
    {
      label: 'Số điện thoại',
      value: 3
    }
  ];
  modelStaff = '';
  listStaff = [];
  query = {
    filter: ''
  }
  isLoading = false;
  dataSearched: any = [];
  dataSearcheSelect: any = [];
  dataInfo:any = null
  empId = '';
  dataInfoCallback: any = []
  isSearching = false
  ngOnInit(): void {

  }

  clearEvent(event) {
    this.modelStaff = '';
  }

  // onSelectStaff(event) {
  //   this.isSearching = false
  //   this.dataSearcheSelect = this.dataSearched.filter( d => event.value === d.empId);
  //   const queryParams = queryString.stringify({ empId: this.dataSearcheSelect[0].empId });
  //   this.empId = this.dataSearcheSelect[0].empId;
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
  //           value: res.empId
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
    this.apiService.getEmployeeSearchPopup(queryString.stringify({ 
        filter: this.query.filter, 
        searchType: this.searchBy,
        sex: this.sex,
        pageSize: 30})).subscribe((results: any) => {
      this.isLoading = false;
      this.dataSearched = results.data.dataList.data;
    })
  }

  getItem() {
    let callbackValue = {
      status: 'ok',
      value: this.empId,
      custId: this.dataInfo.CustId,
      dataInfo: this.dataInfo.empId
    }
    if(this.empId) {
      this.seachEmValue.emit(callbackValue);
      this.isSearch = false
    }else{
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nhân viên'});
    }
  }
  isLoadingInfo = false;
  getEmpInfo(info) {
    this.isLoadingInfo = true;
    const queryParams = queryString.stringify({ empId: info.empId });
    this.empId = info.empId;
    // this.dataInfo = null;
    this.dataInfoCallback = info.empId
    this.apiService.getEmpProfile(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.isLoadingInfo = false;
        this.dataInfo = {
          address: getFieldValueAggrid(results.data, 'origin_add'),
          ...info
        }
      }
    } )
  }


}
