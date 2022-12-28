
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as moment from 'moment';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-an-ca',
  templateUrl: './chi-tiet-an-ca.component.html',
  styleUrls: ['./chi-tiet-an-ca.component.scss']
})
export class ChiTietAnCaComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  optionsButon = [
    { label: 'Hủy', value: 'Back', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetFormsTypePage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check' }
  ];
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
  empId = null;
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

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();
  items = [];
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    // const toDate= moment(new Date()).add(45,'days').format('DD');
    const thanghientai= moment(new Date()).endOf('month').format('DD');
    const a = [];
    const b = [];
    for(let i = 0; i< 45; i++) {
      if(i+ 1 <= parseInt(thanghientai)) {
        a.push(`${i + 1 < 10 ? 0 : ''}${i+1}/${new Date().getMonth() + 1 < 10 ? 0 : ''}${new Date().getMonth() + 1}/${new Date().getFullYear()}`)
      }else {
        let newDay = 45 - i;
        b.push(`${newDay < 10 ? 0 : ''}${newDay}/${new Date().getMonth() + 2 < 10 ? 0 : ''}${new Date().getMonth() + 2}/${new Date().getFullYear()}`)
      }
      this.listDates = [...a, ...b.sort()];
    }
   
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách ăn ca', routerLink: '/chinh-sach/an-ca' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();

  }

  checkdisableddate(day) {
    if(day < parseInt(moment(new Date()).format('DD'))) {
      return true
    }
    return false
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.empId = this.paramsObject.params.empId;
      this.getEatingList();
    });
  };


  detailInfo = null;
  menuDate = []
  columnDefs
  getAnCaInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({ cusId: this.empId });
    this.apiService.getEatingInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.menuDate = cloneDeep(this.detailInfo.menuDate);
      }
    })
  }
  selectedDates = []
  listDates = [];
  getEatingList() {
    const queryParams = queryString.stringify({
      cusId: this.empId,
      fromDate: moment(new Date()).startOf('month').format('DD/MM/YYYY'),
      toDate: moment(new Date()).endOf('month').format('DD/MM/YYYY'),
    });
    this.apiService.getEatingList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.selectedDates = results.data.result.dataList.data.map(d => d.menu_date);
        this.getAnCaInfo();

      }
    })
  }

  showButton() {
    return {
      buttons: [
        {
          onClick: this.OnClick.bind(this),
          label: 'Chỉnh sửa',
          icon: 'fa fa-edit',
          key: 'CHINHSUA',
          class: 'btn-primary mr-1',
        },
        {
          onClick: this.OnClick.bind(this),
          label: 'Xóa',
          key: 'DELETE',
          icon: 'pi pi-trash',
          class: 'btn-danger',
        },

      ]
    };
  }

  OnClick(event) {

    // if (event.event.item.key === 'CHINHSUA') {  
    //   this.modelComAuthorizeInfo = {
    //     auth_id : event.rowData.auth_id,
    //     id: this.custId,
    //     cif_no: ''
    //   }
    //   this.getComAuthorizeInfo();

    //  }else {
    //  }
  }


  handleChange(index) {
    this.indexTab = index;
  }

  setCompanyInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data, menuDate: this.selectedDates
    };
    this.apiService.setEatingInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if(this.url === 'them-moi-nghi-phep') {
          this.goBack()
        }else {
          this.manhinh = 'Edit';
          this.getAnCaInfo();
        }
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
    if (this.titlePage) {
      this.router.navigate(['/chinh-sach/an-ca']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getAnCaInfo();
    }else if(data === "Back"){
      this.router.navigate(['/chinh-sach/an-ca']);
    }else {
      this.manhinh = 'Edit';
      this.getAnCaInfo();
    }
  }

}



