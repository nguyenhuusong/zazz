import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent implements OnInit {
  @Input() contractId = null;
  @Input() empId = null;
  optionsButtonsPopup = [
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ];
  is_full_submit = false;

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';
  files = null
  displayuploadcontract = false;
  ngOnInit(): void {
    this.getContractMetaPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  DeleteMeta(event) {

  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }


  getContractMetaPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ contractId: this.contractId, offSet: 0, pageSize: 10000 });
    this.apiService.getContractMetaPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid('columnDefs', repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_hopdong`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addContract()
        });
      }
    }, 300);
  }

  addContract() {
    this.getContractRecord();
  }

  initGrid(columnDefs ,gridflexs) {
    this[columnDefs] = [
      ...AgGridFn(gridflexs || []),
      columnDefs === 'columnDefs' ? {
        field: '',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.dowloadFile.bind(this),
                label: 'File mẫu',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileDemo.bind(this),
                label: 'Tải file mẫu',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileUpload.bind(this),
                label: 'Tải về hồ sơ đã ký',
                icon: 'pi pi-upload',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
                hide: !params.data.meta_upload_url
              },

            
            ]
          };
        },
      } : {
        
        field: '',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.dowloadFile.bind(this),
                label: 'File mẫu',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileDemo.bind(this),
                label: 'Tải file mẫu',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileupload.bind(this),
                label: 'Tải về file đã ký',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
                hide: !params.data.meta_upload_url
              },
              {
                onClick: this.uploadFile.bind(this),
                label: 'Tải lên file ký duyệt',
                icon: 'pi pi-upload',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  dowloadFileDemo({rowData}) {
    this.downloadButtonClicked(rowData.temp_download_url)
  }

  dowloadFile({rowData}) {
    this.downloadButtonClicked(rowData.temp_view_url)
  }

  dowloadFileupload({rowData}) {
    this.downloadButtonClicked(rowData.meta_upload_url)
  }

  dowloadFileUpload({rowData}) {
    this.downloadButtonClicked(rowData.meta_upload_url)
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  trainId = null;
  editRow({rowData}) {
    this.trainId = rowData.trainId
    // this.getTrainFile();
  }
  columnDefsRecord = [];
  listsDataRecord = [];
  dataDetailInfo = null;
  displayFormEditDetail =false;
  getContractRecord() {
    this.columnDefsRecord = [];
    const queryParams = queryString.stringify({ contractId: this.contractId});
    this.apiService.getContractRecord(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listsDataRecord = results.data.records || [];
        this.dataDetailInfo = results.data;
        this.is_full_submit = this.dataDetailInfo.is_full_submit;
        this.initGrid('columnDefsRecord',results.data.gridflexdetails1);
        this.displayFormEditDetail = true;
      } else {
        this.spinner.hide();
      }
    })
  }

  saveContractRecord() {
    const params = {
      ...this.dataDetailInfo,
      gridflexdetails1: this.dataDetailInfo.gridflexdetails1,
      records: this.listsDataRecord,
      is_full_submit: this.is_full_submit
    }
    this.apiService.setContractRecord(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;

        this.getContractMetaPage();
        this.cancelSave.emit();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  }
  metafile = null;
  uploadFile(event) {
    this.metafile = event.rowData;
    this.displayuploadcontract = true;
  }

  
  handleUpload(event) {
    console.log(event)
    let params = {...this.metafile}
    const formData= new FormData();
    formData.append('sourceId', this.contractId);
    formData.append('metaId', params.metaId);
    formData.append('empId', this.empId);
    formData.append('formFile', event.length >0 ? event[0].file: null);
    this.apiService.setContractRecordUpload(formData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayuploadcontract = false;
        this.getContractMetaPage();
        this.spinner.hide();
      } else {
        console.log(results)
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })





    // if(event && event.length > 0) {
    //   this.columnDefsRecord = [];

    //   params.meta_upload_url = event[0].url;
    //   params.meta_file_name = event[0].name;
    //   params.meta_file_type = event[0].type;
    //   params.meta_file_size = event[0].size;
    //   const indexObj = this.listsDataRecord.findIndex(d => d.sourceId === params.sourceId);
    //   this.listsDataRecord[indexObj] = params;
    //   this.listsDataRecord = [...this.listsDataRecord];
    //   this.initGrid('columnDefsRecord',this.dataDetailInfo.gridflexdetails1);
    //   this.displayuploadcontract = false;
    // }
  }

  getFilesDetail(event) {
    this.files = event;
  }

}
