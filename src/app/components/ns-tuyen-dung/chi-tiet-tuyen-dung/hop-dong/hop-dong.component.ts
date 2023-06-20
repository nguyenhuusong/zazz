import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-ho-so',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent implements OnInit {
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ];
  is_full_submit = false;

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @Input() canId = null;
  @Output() callBack = new EventEmitter<any>();
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
    this.getCandidateFilePage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  getCandidateFilePage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ canId: this.canId, offSet: 0, pageSize: 10000 });
    this.apiService.getCandidateFilePage(queryParams)
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
      var dragTarget = document.getElementById(`${this.gridKey}_hoso`);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.uploadFile()
        });
      }
    }, 300);
  }
  initGrid(columnDefs, gridflexs) {
    this[columnDefs] = [
      ...AgGridFn(gridflexs || []),
      {
        field: '',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 120,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.dowloadFile.bind(this),
                label: 'Xem file',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
            ]
          };
        },
      }
    ];
  }

  dowloadFileDemo({ rowData }) {
    this.downloadButtonClicked(rowData.temp_download_url)
  }

  dowloadFile({ rowData }) {
    this.downloadButtonClicked(rowData.temp_view_url)
  }

  dowloadFileupload({ rowData }) {
    this.downloadButtonClicked(rowData.meta_upload_url)
  }

  dowloadFileUpload({ rowData }) {
    this.downloadButtonClicked(rowData.meta_upload_url)
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      // this.editRow(event = {rowData: event.data})
    }
  }

  idFile: any = null
  uploadFile() {
    this.idFile = null;
    this.displayuploadcontract = true;
  }

  handleUpload(event) {
    const formData = new FormData();
    formData.append('id', this.idFile ? this.idFile : '');
    formData.append('canId', this.canId ? this.canId : '');
    formData.append('formFile', event.length > 0 ? event[0].file : null);
    this.apiService.setCandidateFile(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
          this.displayuploadcontract = false;
          this.getCandidateFilePage();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      })
  }

  getFilesDetail(event) {
    this.files = event;
  }

}
