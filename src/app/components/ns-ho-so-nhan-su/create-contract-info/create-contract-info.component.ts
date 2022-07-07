import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-create-contract-info',
  templateUrl: './create-contract-info.component.html',
  styleUrls: ['./create-contract-info.component.css']
})
export class CreateContractInfoComponent implements OnInit {
  listViews = [];
  listsData = [];
  detailInfo = null;
  displayuploadcontract = false;
  metafile = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { } 

  optionsButon = [
    // { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  },
    { label: 'Tạm tính', value: 'TamTinh', class: '', icon: 'pi pi-check'  }
  ]
  listContractTypes = [];
  indexTab = 0;
  @Input() modelContractInfo: any = null
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  titlePage = '';
  url = '';
  itemsMenu = [];
  paramsObject = null;
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    if (this.url === 'chi-tiet-xu-ly-hop-dong') {
      this.optionsButon= [
        { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  },
      ]
      this.itemsMenu =  [
        { label: 'Trang chủ' , routerLink: '/home' },
        { label: 'Danh sách xử lý hợp đồng' , routerLink: '/nhan-su/xu-ly-hop-dong'},
        { label: `${this.titlePage}` },
      ]
      this.handleParams();
    } else {
      this.optionsButon= [
        { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  },
        { label: 'Tạm tính', value: 'TamTinh', class: '', icon: 'pi pi-check'  }
      ]
      this.getContractInfo();
    }
  }

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelContractInfo = this.paramsObject.params;
      this.getContractInfo();
    });
  }

  getContractTypes() {
    const queryParams = queryString.stringify({ organizeId: this.modelContractInfo.organizeId });
    this.apiService.getContractTypes(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listContractTypes = results.data.map(d => {
          return {
            label: d.contractTypeName,
            value: d.contractType
          }
        });
      }
    })
  }
  columnDefsMetafiles = [];
  stepsLine = [];
  columnDefsSalaryComponents = [];
  getContractInfo() {
    this.detailInfo = null;
    this.listViews = [];
    this.listsData = [];
    this.spinner.show();
    let params = {...this.modelContractInfo};
    if (this.url !== 'chi-tiet-xu-ly-hop-dong') {
        delete params.detailInfo
    }
    const queryParams = queryString.stringify(params);
    this.apiService.getContractInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.restData(results);
        this.activeIndex = results.data.flow_st;
        if(this.activeIndex === 1 || this.activeIndex === 2) {
          this.optionsButon =[
            { label: 'Đã ký', value: 'DaKyHD', class: '', icon: 'pi pi-check'  },
          ];
        }else if(this.activeIndex > 3) {
          this.optionsButon =[
            { label: 'Tải file', value: 'TaiFileHD', class: '', icon: 'pi pi-upload'  },
            { label: 'Hoàn thành', value: 'HoanThanhHD', class: '', icon: 'pi pi-check'  }
          ];
        }
        this.stepsLine = results.data.flowStatuses.map( d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.columnDefsSalaryComponents = [
          ...AgGridFn(this.detailInfo.gridflexdetails2 || [])]
        this.columnDefsMetafiles = [
          ...AgGridFn(this.detailInfo.gridflexdetails1 || []),
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
                    onClick: this.OnClick.bind(this),
                    label: 'Tải về hồ sơ mẫu',
                    icon: 'pi pi-cloud-upload',
                    key: 'taivehosomau',
                    class: 'btn-primary mr5',
                    hide: !params.data.temp_download_url
                  },
                  {
                    onClick: this.OnClick.bind(this),
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
                    onClick: this.OnClick.bind(this),
                    label: 'Tải lên hồ sơ',
                    icon: 'pi pi-cloud-download',
                    class: 'btn-primary mr5',
                    key: 'tailenhoso',
                    hide: params.data.meta_upload_url
                  },
                  {
                    onClick: this.OnClick.bind(this),
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
        this.spinner.hide();
      }
    })
  }
  activeIndex = 0
  stepActivated(): void {
    const stepS = document.querySelectorAll('.status-line .p-steps-item');
    if(stepS.length > 0){
      for (let i = 0; i < this.stepsLine.length; i++) {
        if (i <= this.activeIndex) {
          stepS[i].className += ' active';
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  restData(results) {
    this.listViews = cloneDeep(results.data.group_fields);
    this.detailInfo = results.data;
    // this.getContractTypes()
    if(this.indexTab === 1) {
      this.listsData = cloneDeep(results.data.salary_components) || [];
    }else {
      this.listsData = cloneDeep(results.data.metafiles) || [];
    }
   
  }

  handleChange(index) {
    this.indexTab = index
    if (this.indexTab === 0) {
      this.listsData = this.detailInfo.metafiles || [];
    } else {
      this.listsData = this.detailInfo.salary_components || [];
    }
  }

  OnClick(event): void {
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

  uploadContract(event) {
    if(event.rowData.metaId) {
      this.displayuploadcontract = true;
      this.metafile = event.rowData;
    }else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa lưu hợp đồng' });
    }
  }

  ViewContract(event) {
    this.downloadButtonClicked(event.rowData.meta_upload_url);
  }

  DowloadFileDemo(event, type) {
    console.log(event, 'fjdosfjio');
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

  handleUploadAll(datas) {
    if (datas.length > 0) {
      this.spinner.show();
      const queryParams = queryString.stringify({linkContract: datas[0].url });
      this.apiService.setContractSignedUpload(this.detailInfo.contractId, queryParams).subscribe(
        results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Upload hợp đồng thành công' });
            this.displayuploadcontractall = false;
            this.getContractInfo();
            this.spinner.hide();
          }else {
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
         
        }
      );
    }
  }


  // SaveUploadContract(event) {
  //   this.spinner.show();
  //   if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
  //     const getDAte = new Date();
  //     const getTime = getDAte.getTime();
  //     const storageRef = firebase.storage().ref();
  //     const uploadTask = storageRef.child(`sipt/file-contract/${getTime}-${event.currentFiles[0].name})`).put(event.currentFiles[0]);
  //     uploadTask.on('state_changed', (snapshot) => {
  //     }, (error) => {
  //       this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.message });
  //       this.spinner.hide();
  //     }, () => {
  //       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //         if (downloadURL) {
  //           const indexobj = this.listsData.findIndex(d => d.tpl_type === this.metafile.tpl_type);
  //           let metafile = { ... this.listsData[indexobj] };
  //           metafile.meta_file_url = downloadURL;
  //           metafile.meta_file_type = event.currentFiles[0].type;
  //           metafile.meta_file_size = event.currentFiles[0].size;
  //           metafile.meta_file_name = event.currentFiles[0].name;
  //           this.listsData[indexobj] = metafile;
  //           this.listsData = [... this.listsData];
  //           this.detailInfo.metafiles = this.listsData
  //           this.displayuploadcontract = false;
  //           this.spinner.hide();
  //         }
  //       });
  //     });
  //   }
  // }

  setContractInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.spinner.show();
    this.apiService.setContractInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Tạo hợp đồng thành công' });
        this.callback.emit();
        this.spinner.hide();
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  // contract nháp
  saveCallback1(data) {
    this.listViews = [];
    this.listsData = [];
    this.columnDefsMetafiles = [];
    this.columnDefsSalaryComponents = []; 
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.spinner.show();
    this.apiService.setContractDraft(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Tạm tính thành công' });
        // this.callback.emit();
        this.restData(results)
        results.data.gridflexdetails2.forEach(element => {
          element.cellClass = element.cellClass || []
        });
        results.data.gridflexdetails1.forEach(element => {
          element.cellClass = element.cellClass || []
        });
        this.columnDefsSalaryComponents = [
          ...AgGridFn(results.data.gridflexdetails2 || [])]
        this.columnDefsMetafiles = [
          ...AgGridFn(results.data.gridflexdetails1 || []),
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
            field: 'meta_upload_url',
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
        // this.getContractInfo();
        this.spinner.hide();
      }
    })
  }

  displayuploadcontractall = false;
  huy(value) {
    if(value) {
      if(value === 'DaKyHD') {
        this.confirmationService.confirm({
          message: 'Bạn có chắc chắn muốn thực hiện hành động này .?',
          accept: () => {
            this.spinner.show();
            const queryParams = queryString.stringify({contractId: this.detailInfo.contractId, isSigned: true});
            this.apiService.setContractSigned(queryParams).subscribe((results: any) => {
              if (results.status === 'success') {
                this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xác nhận ký thành công !' });
                this.getContractInfo();
                this.spinner.hide();
              } else {
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
                this.spinner.hide();
              }
            });
          }
        });
        
      }else if(value === 'TaiFileHD') {
        this.displayuploadcontractall = true;
      }else if(value === 'HoanThanhHD') {
        this.confirmationService.confirm({
          message: 'Bạn có chắc chắn muốn thực hiện hành động này .?',
          accept: () => {
            this.spinner.show();
            const queryParams = queryString.stringify({contractId: this.detailInfo.contractId, isCompleted: true});
            this.apiService.setContractSigned(queryParams).subscribe((results: any) => {
              if (results.status === 'success') {
                this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xác nhận hoàn thành !' });
                this.getContractInfo();
                this.spinner.hide();
              } else {
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
                this.spinner.hide();
              }
            });
          }
        });
      }else {
        this.modelContractInfo.contractTypeId = value;
        this.getContractInfo();
      }
      
    }else {
      this.back.emit();
    }
  }
}
