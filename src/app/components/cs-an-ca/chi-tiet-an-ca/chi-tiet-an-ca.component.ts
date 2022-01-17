
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
  selector: 'app-chi-tiet-an-ca',
  templateUrl: './chi-tiet-an-ca.component.html',
  styleUrls: ['./chi-tiet-an-ca.component.scss']
})
export class ChiTietAnCaComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
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
  id = null
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
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' },
      { label: 'Chính sách' },
      { label: 'Danh sách ăn ca', url: '/chinh-sach/an-ca' },
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
      this.id = this.paramsObject.params.id;
      this.getAnCaInfo();
    });
  };


  detailInfo = null;
  listsData = []
  columnDefs
  getAnCaInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({ id: this.id });
    this.apiService.getEatingInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        // this.listsData = cloneDeep(this.detailInfo.authorizes);
        // this.columnDefs = [...AgGridFn(this.detailInfo.gridflexs || []), {
        //   headerName: '',
        //   field: 'button',
        //   filter: '',
        //   pinned: 'right',
        //   width: 60,
        //   cellRenderer: 'buttonRendererMutiComponent',
        //   cellClass: ['border-right'],
        //   cellRendererParams: params => this.showButton()
        // }];
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
    //     id: this.id,
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
    // const params = {
    //   ...this.detailInfo, group_fields: data
    // };
    // this.apiService.setCompanyInfo(params).subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.displayUserInfo = false;
    //     if(this.url === 'them-moi-nghi-phep') {
    //       this.goBack()
    //     }else {
    //       this.manhinh = 'Edit';
    //       this.getAnCaInfo();
    //     }
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
    //   } else {
    //     this.messageService.add({
    //       severity: 'error', summary: 'Thông báo', detail: results.message
    //     });
    //   }
    // }, error => {
    // });
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

  cancelUpdate() {
    this.manhinh = 'Edit';
    this.getAnCaInfo();
  }

}



