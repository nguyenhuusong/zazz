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
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Tiếp tục', value: 'Update', class: '', icon: 'pi pi-save' },
  ];
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
  activeIndex = 0
  ngOnInit(): void {
    if (this.modelContractInfo.contractId) {
      this.getContractInfo();
    } else {
      this.setContractCreate();
    }
  }
 
  setContractCreate() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    this.apiService.setContractCreate({ empId: this.modelContractInfo.empId }).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
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
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.activeIndex) {
          stepS[i].className += ' active';
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
      this.listViews = [];
      const params = {
        ...this.detailInfo, flow_st: this.activeIndex - 1
      }
      this.callApiInfo(params)
    } else {
      this.back.emit();
    }
  }

  setContractInfo(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data, flow_st: this.activeIndex + 1
    }
    this.callApiInfo(params)

  }


  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setContractInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.activeIndex = results.data.flow_st;
        // this.steps = results.data.flowStatuses.map(d => {
        //   return {
        //     label: d.flow_name,
        //     value: d.flow_st
        //   }
        // });
        if(results.data.flow_st === 0) {
          this.optionsButon = [
            { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tiếp tục', value: 'Update', class: '', icon: 'pi pi-save' },
          ];
        }else {
          this.optionsButon = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tiếp tục', value: 'Update', class: '', icon: 'pi pi-save' },
          ];
         if(results.data.flow_st > 1) this.getContractMetaPage();
         if(results.data.flow_st > 0 && results.data.contractId) this.getSalaryComponentPage();
         if(results.data.flow_st > 0 && !results.data.contractId) this.getSalaryComponentPageNotContractId(results.data);
        }
       
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.spinner.hide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getContractInfo() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ contractId: this.modelContractInfo.contractId });
    this.apiService.getContractInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        if(results.data.flow_st === 0) {
          this.optionsButon = [
            { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tiếp tục', value: 'Update', class: '', icon: 'pi pi-save' },
          ];
        }else {
          this.optionsButon = [
            { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tiếp tục', value: 'Update', class: '', icon: 'pi pi-save' },
          ];
        }
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
        this.detailInfo = results.data;
        if(results.data.flow_st > 1) this.getContractMetaPage();
        if(results.data.flow_st > 0) this.getSalaryComponentPage();
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
