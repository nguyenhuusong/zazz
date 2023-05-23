import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chi-tiet-hop-dong',
  templateUrl: './chi-tiet-hop-dong.component.html',
  styleUrls: ['./chi-tiet-hop-dong.component.scss']
})
export class ChiTietHopDongComponent implements OnInit, OnChanges {
  @Input() contractTypeId = '';
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();
  @Output() callback = new EventEmitter<any>();

  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetContractTypePage.url, ACTIONS.EDIT) ? 'hidden' : '' },
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  organizeId = null
  org_level = 0
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

  ngOnChanges() {

  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  items = [];
  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách loại hợp đồng', routerLink: '/cai-dat/quan-ly-hop-dong' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();

  }

  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      // this.contractTypeId = this.paramsObject.params.contractTypeId || null;
      this.organizeId = this.paramsObject.params.organizeId || null;
      this.getContractTypeInfo();
    });
  };
  listsData = [];
  columnDefs = [];
  detailInfo = null;
  getContractTypeInfo() {
    this.listViews = [];
    this.columnDefs = [];
    const queryParams = queryString.stringify({contractTypeId: this.contractTypeId});
    this.apiService.getContractTypeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.metafiles);
        this.columnDefs = [...AgGridFn(this.detailInfo.gridflexdetails1 || []),
        {
          headerName: 'Thao tác',
          filter: '',
          width: 100,
          pinned: 'right',
          cellRenderer: 'buttonAgGridComponent',
          cellClass: ['border-right', 'no-auto'],
          cellRendererParams: (params: any) => this.showButtons(params),
          checkboxSelection: false,
          field: 'checkbox'
        }];
      }
    })
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.ViewContract.bind(this),
          label: 'Xem file',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.DowloadFileDemo.bind(this),
          label: 'DowloadFile',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_file_tpl);
  }

  DowloadFileDemo(event) {
    this.downloadButtonClicked(event.rowData.temp_download_url);
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setContractTypeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setContractTypeInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.goBack()
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
   if(this.titlePage) {
     const params = {
      organizeId: this.organizeId
     }
    this.router.navigate(['/cai-dat/quan-ly-hop-dong'], { queryParams: params });
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(e) {
    if(e === 'CauHinh') {
      this.getContractTypeInfo();
    }else {
      this.goBack();
    }
  }


}


