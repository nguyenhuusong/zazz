import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';

@Component({
  selector: 'app-chi-tiet-hop-dong',
  templateUrl: './chi-tiet-hop-dong.component.html',
  styleUrls: ['./chi-tiet-hop-dong.component.scss']
})
export class ChiTietHopDongComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  contractTypeId = null
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

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnChanges() {

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
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.contractTypeId = this.paramsObject.params.contractTypeId || null;
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
    this.apiService.getContractTypeInfo(queryParams).subscribe(results => {
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
    this.downloadButtonClicked(event.rowData.temp_view_url);
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
    this.apiService.setContractTypeInfo(params).subscribe((results: any) => {
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
    this.router.navigate(['/cai-dat/quan-ly-hop-dong']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(e) {
    this.goBack();
  }


}


