
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-nguoi-phu-thuoc',
  templateUrl: './chi-tiet-nguoi-phu-thuoc.component.html',
  styleUrls: ['./chi-tiet-nguoi-phu-thuoc.component.scss']
})
export class ChiTietNguoiPhuThuocComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButon = [{ label: 'Lưu lại', value: 'Update', class: 'p-button-sm', icon: 'pi pi-check' },{ label: 'Hủy', value: 'Cancel', class: 'p-button-secondary p-button-sm', icon: 'pi pi-times' },];
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
  dependentId = null
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
  empId = null;
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  items = [];
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách người phụ thuộc', routerLink: '/luong-thue/danh-sach-nguoi-phu-thuoc' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.dependentId = this.paramsObject.params.dependentId;
      this.empId = this.paramsObject.params.empId;
        this.getEmpDependent();
    });
  };

  getEmpDependent() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify(this.paramsObject.params);
    this.apiService.getEmpDependent(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setEmpDependent(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpDependent(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc']);
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
      this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getEmpDependent();
    }else {
      this.router.navigate(['/luong-thue/danh-sach-nguoi-phu-thuoc']);
    }
  }

}



