import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as moment from 'moment';
@Component({
  selector: 'app-chi-tiet-ho-so-nghi-viec',
  templateUrl: './chi-tiet-ho-so-nghi-viec.component.html',
  styleUrls: ['./chi-tiet-ho-so-nghi-viec.component.scss']
})
export class ChiTietHoSoNghiViecComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' },
    { label: 'Tuyển dụng lại', value: 'ReHire', icon: 'pi pi-refresh' },
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' }
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
  terminateId = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage : string = '';
  url: string = '';
  items = [];
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  modelDuyet = {
    empId: "",
    workDt: new Date(),
    comments: "",
    full_name: ""
  }
  listViewsEmp = [];
  listViewsFormEmp = [];
  detailInfoEmp = null;
  showRehire = false;
  

  ngOnChanges() {
    // this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
    // this.titlePage = null;
    // this.id = this.dataRouter.id;
    // this.manhinh = 'Edit';
    // this.getAccountInfo();
  }

  ngOnInit(): void {
   
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Nhân sự' },
      { label: 'Hồ sơ nhân sự nghỉ việc', url: 'nhan-su/ho-so-nghi-viec' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.terminateId = this.paramsObject.params.terminateId;
      this.empId = this.paramsObject.params.empId;
      this.getTerminateInfo();
      this.getEmployeeInfo();
    });
  };
  detailInfo = null;
  listsData = []
  columnDefs
  getTerminateInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({id: this.terminateId});
    this.apiService.getTerminateInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = this.detailInfo.metafiles || [];
        this.columnDefs = [
          ...AgGridFn(this.detailInfo.gridflexdetails1 || []),
          {
            headerName: 'Hồ sơ mẫu',
            field: 'meta_file_tpl',
            cellClass: ['border-right'],
            width: 100,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Tải về hồ sơ mẫu',
                    icon: 'pi pi-cloud-upload',
                    key: 'taivehosomau',
                    class: 'btn-primary mr5',
                    hide: !params.data.temp_download_url
                  }, {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem hồ sơ mẫu',
                    icon: 'pi pi-cloud-upload',
                    key: 'xemhosomau',
                    class: 'btn-primary mr5',
                    hide: !params.data.temp_view_url
                  },
                ]
              };
            },
          },
          {
            headerName: 'Tải lên hồ sơ',
            field: 'meta_file_url',
            cellClass: ['border-right'],
            width: 100,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Tải lên hồ sơ',
                    icon: 'pi pi-cloud-download',
                    class: 'btn-primary mr5',
                    key: 'tailenhoso',
                    hide: !params.data.meta_id
                  },
                  {
                    onClick: this.OnClick.bind(this),
                    label: 'Xem hồ sơ tải lên',
                    icon: 'pi pi-cloud-upload',
                    key: 'xemhoso',
                    class: 'btn-primary mr5',
                    hide: !params.data.meta_file_url
                  },
                 
                ]
              };
            },
          }
        ];

      }
    })
  }


  OnClick(event) {
    if (event.event.item.key === 'tailenhoso') {
      this.uploadContract(event)
    } else if (event.event.item.key === 'xemhoso') {
      this.ViewContract(event)
    } else if (event.event.item.key === 'taivehosomau') {
      this.DowloadFileDemo(event, 'taivehosomau')
    } else if (event.event.item.key === 'xemhosomau') {
      this.DowloadFileDemo(event, 'xemhosomau')
    }
  }
  displayuploadcontract;
  metafile

  uploadContract(event) {
    this.displayuploadcontract = true;
    this.metafile = event.rowData;
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_file_url);
  }

  DowloadFileDemo(event, type) {
    this.downloadButtonClicked(type === 'taivehosomau' ? event.rowData.temp_download_url : event.rowData.temp_view_url);
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  handleUpload(datas) {
    if (datas.length > 0) {
    
      this.apiService.setContractUpload({ meta_id: this.metafile.meta_id, meta_upload_url: datas[0].url }).subscribe(
        results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Upload hợp đồng ký thành công' });
            this.displayuploadcontract = false;
            this.getTerminateInfo();
          }
        }
      );
    }
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setTerminateInfo(data) {
    // const params = {
    //   ...this.detailInfo, group_fields: data
    // }
    // this.apiService.setTerminateInfo(params).subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
    //     this.getTerminateInfo();
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
   if(this.titlePage) {
    this.router.navigate(['/nhan-su/ho-so-nghi-viec']);
   }else {
    this.back.emit();
   }
  }


  handleRehire(data): void {
    let parmas: any = { ...this.modelDuyet };
    delete parmas.full_name;
    parmas.workDt = moment(new Date(parmas.workDt)).format('DD/MM/YYYY');
    delete parmas.reason_id;
    delete parmas.exprire_date;
    parmas.group_fields = cloneDeep(this.listViewsFormEmp);
    console.log(parmas);
    this.apiService.setEmployeeRehired(parmas)
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.showRehire = false;
        this.manhinh = 'Edit';
        this.getTerminateInfo();
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận tuyển dụng lại thành công!' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  getEmployeeInfo(): void {
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeData('GetEmployeeByJob', queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsEmp = cloneDeep(results.data.group_fields || []);
        this.listViewsFormEmp = cloneDeep(results.data.group_fields || []);
        this.detailInfoEmp = results.data;
        this.modelDuyet.full_name = results.data.fullName;
        this.modelDuyet.empId = this.empId
      }
    });
  }

  callbackButton(data) {
    if (data.type === 'rehire') {
      this.showRehire = true;
    }
  }

  cancelUpdate() {
    this.router.navigate(['/nhan-su/ho-so-nghi-viec']);
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
