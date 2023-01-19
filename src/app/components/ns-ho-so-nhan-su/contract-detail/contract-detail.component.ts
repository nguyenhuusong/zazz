import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit {
  @Input() modelContractInfo: any = null
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButtonsView = [
    { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
    { label: 'Tiếp tục', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Xác nhận', value: 'Submit', class: 'btn-accept', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Close', class: 'btn-accept', icon: 'pi pi-times' }
  ]
  columnDefs = [];
  listsData = [];
  gridflexs= [];
  columnDefs_1 = [];
  listsData_1 = [];
  gridflexs_1= [];
  gridKey = '';
  gridKey_1 = '';
  displayuploadcontract = false;
  metafile = null;
  displaySetting= false;
  gridKeyForm= '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  ngOnInit(): void {

    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    if (this.url === 'chi-tiet-xu-ly-hop-dong') {
      this.itemsMenu =  [
        { label: 'Trang chủ' , routerLink: '/home' },
        { label: 'Danh sách xử lý hợp đồng' , routerLink: '/nhan-su/xu-ly-hop-dong'},
        { label: `${this.titlePage}` },
      ]
      this.handleParams();
    } else {
      if (this.modelContractInfo.contractId) {
        this.getContractInfo();
      } else {
        this.setContractCreate();
      }
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelContractInfo = this.paramsObject.params;
      if (this.modelContractInfo.contractId) {
        this.getContractInfo();
      } else {
        this.setContractCreate();
      }
    });
  }
 
  setContractCreate() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    this.apiService.setContractCreate({ empId: this.modelContractInfo.empId }).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        console.log(this.activeIndex)
        if (i <= this.flowCurrent) {
          stepS[i].className +=  ` p-highlight ${i<= this.activeIndex? 'active' : 'remove-active'}`;
          stepS[i].className +=  ` ${i<= this.flowCurrent ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
        
      }
    }
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.modelContractInfo.contractId ? this.getContractInfo() : this.setContractCreate();
    } else if (data === 'BackPage') {
      this.getContractInfo(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent - 1)
    } else if(data === 'Dowload') {
      for(let item of this.listsData) {
        this.downloadButtonClicked(item.temp_download_url);
      }
    } else {
      if(this.url === 'chi-tiet-xu-ly-hop-dong') {
        this.router.navigate(['/nhan-su/xu-ly-hop-dong'])
      }else {
        this.back.emit();
      }
    }
  }

  setContractInfo(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent
    }
    this.cloneListViews = cloneDeep(this.listViews); 
    this.listViews = [];
    this.callApiInfo(params)
   
  }
  cloneListViews = []
  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data, flow_cur: this.flowCurrent
    }
    this.cloneListViews = cloneDeep(this.listViews); 
    this.listViews = [];
    this.callApiInfo(params, event.type);
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setContractInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        console.log("results.data.flow_st", results.data.flow_st)
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.flowCurrent = results.data.flow_cur;
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          // { label: 'Tải về hồ sơ mẫu', value: 'Dowload', class: `btn-accept ${results.data.flow_cur > 1 ? '' : 'hidden'} ml-1`, icon: 'pi pi-dowload' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        if(results.data.flow_cur > 1 && results.data.contractId) this.getContractMetaPage();
        if((results.data.flow_cur > 0 && results.data.flow_cur < 4) && results.data.contractId) this.getSalaryComponentPage();
        if((results.data.flow_cur > 0 && results.data.flow_cur < 4)  && !results.data.contractId) this.getSalaryComponentPageNotContractId(results.data);
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });

        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            if(this.url === 'chi-tiet-xu-ly-hop-dong') {
              this.router.navigate(['/nhan-su/xu-ly-hop-dong'])
            }else {
              this.callback.emit();
            }
          }, 200);
        }
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
        this.flowCurrent = this.detailInfo.flow_cur;
        this.activeIndex = this.detailInfo.flow_st;
        if(this.detailInfo.flow_cur > 1 && this.detailInfo.contractId) this.getContractMetaPage();
        if((this.detailInfo.flow_cur > 0 && this.detailInfo.flow_cur < 4) && this.detailInfo.contractId) this.getSalaryComponentPage();
        if((this.detailInfo.flow_cur > 0 && this.detailInfo.flow_cur < 4)  && !this.detailInfo.contractId) this.getSalaryComponentPageNotContractId(this.detailInfo);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getContractInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ contractId: this.modelContractInfo.contractId, flow_cur: flow_cur });
    this.apiService.getContractInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
       
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          // { label: 'Tải về hồ sơ mẫu', value: 'Dowload', class: `btn-accept ${results.data.flow_cur > 1 ? '' : 'hidden'} ml-1`, icon: 'pi pi-dowload' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.detailInfo = results.data;
        if(results.data.flow_cur > 1) this.getContractMetaPage();
        if(results.data.flow_cur > 0) this.getSalaryComponentPage();
        this.spinner.hide();
      }
    })
  }

 
  getContractMetaPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ contractId: this.detailInfo.contractId, offSet: 0, pageSize: 10000 });
    this.apiService.getContractMetaPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        this.listsData = repo.data.dataList.data;
        this.gridflexs = repo.data.gridflexs;
        if (repo.data.dataList.gridKey) {
          this.gridKey_1 = repo.data.dataList.gridKey
        }
        this.spinner.hide();
        this.initGrid();
      } else {
        this.spinner.hide();
      }
    })
  }

  getSalaryComponentPage() {
    this.spinner.show();
    this.columnDefs_1 = [];
    const queryParams = queryString.stringify({ contractId: this.detailInfo.contractId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalaryComponentPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        this.listsData_1 = repo.data.dataList.data;
        this.gridflexs_1 = repo.data.gridflexs;
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey
        }
        this.spinner.hide();
        this.initGrid_1();
      } else {
        this.spinner.hide();
      }
    })
  }

  getSalaryComponentPageNotContractId(datainfo) {
    this.columnDefs_1 = [];
    this.listsData_1 = datainfo.salary_components;
    this.gridflexs_1 = datainfo.gridflexdetails2 ? datainfo.gridflexdetails2 : [];
    this.initGrid_1();
  }

  initGrid_1() {
    this.columnDefs_1 = [
      ...AgGridFn(this.gridflexs_1.filter((d: any) => !d.isHide)),
     ]
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs || []),
      {
        headerName: 'Hồ sơ mẫu',
        field: 'temp_download_url',
        cellClass: ['border-right'],
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.DowloadFileDemo.bind(this),
                label: 'Tải về hồ sơ mẫu',
                icon: 'pi pi-cloud-upload',
                key: 'taivehosomau',
                class: 'btn-primary mr5',
                hide: !params.data.temp_download_url
              },
              {
                onClick: this.ViewHoSomau.bind(this),
                label: 'Xem file mẫu',
                icon: 'pi pi-cloud-upload',
                key: 'xemhosomau',
                class: 'btn-primary mr5',
                hide: !params.data.temp_view_url
              }
            ]
          };
        },
      },
      {
        headerName: 'Tải lên hồ sơ',
        field: 'meta_upload_url',
        cellClass: ['border-right'],
        width: 100,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.uploadContract.bind(this),
                label: 'Tải lên hồ sơ',
                icon: 'pi pi-cloud-download',
                class: 'btn-primary mr5',
                key: 'tailenhoso',
                hide: params.data.meta_upload_url
              },
              {
                onClick: this.ViewContract.bind(this),
                label: 'Xem hồ sơ tải lên',
                icon: 'pi pi-cloud-upload',
                key: 'xemhoso',
                class: 'btn-primary mr5',
                hide: !params.data.meta_upload_url
              },
              // {
              //   onClick: this.OnClick.bind(this),
              //   label: 'Hủy hồ sơ',
              //   icon: 'pi pi-trash',
              //   key: 'huyhosoky',
              //   class: 'btn-danger',
              // },

            ]
          };
        },
      }
    ];
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_upload_url);
  }

  uploadContract(event) {
    if(event.rowData.metaId) {
      this.displayuploadcontract = true;
      this.metafile = event.rowData;
    }else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa lưu hợp đồng' });
    }
  }

  handleUpload(datas) {
    if (datas.length > 0) {
      this.apiService.setContractUpload({ metaId: this.metafile.metaId, meta_upload_url: datas[0].url }).subscribe(
        results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Upload hợp đồng ký thành công' });
            this.displayuploadcontract = false;
            this.getContractInfo();
          }else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        }
      );
    }
  }

  DowloadFileDemo(event) {
    this.downloadButtonClicked(event.rowData.temp_download_url);
  }

  ViewHoSomau(event) {
    this.downloadButtonClicked(event.rowData.temp_view_url);
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

 
  CauHinh(type) {
    this.gridKeyForm = type === 0 ? this.gridKey : this.gridKey_1
    this.displaySetting = true;
  }
}
