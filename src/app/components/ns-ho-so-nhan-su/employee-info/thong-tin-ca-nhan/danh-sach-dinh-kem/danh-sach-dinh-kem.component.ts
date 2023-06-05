import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-danh-sach-dinh-kem',
  templateUrl: './danh-sach-dinh-kem.component.html',
  styleUrls: ['./danh-sach-dinh-kem.component.scss']
})
export class DanhSachDinhKemComponent implements OnInit {
  @Input() empId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_dinhkem`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
         this.themMoiDinhKem();
        });
      }
    }, 300);
  }


  ngOnInit(): void {
    this.getEmpPersonalPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  themMoiDinhKem() {
    this.addEmpPersonal();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  addEmpPersonal() {
    const queryParams = queryString.stringify({ empId: this.empId});
    this.listViewsDetail = [];
    this.apiService.addEmpPersonal(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }
  metaId = null;
  getEmpAttach() {
    const queryParams = queryString.stringify({ metaId: this.metaId});
    this.listViewsDetail = [];
    this.apiService.getEmpAttach(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }


  setDetailInfo(data) {
    const formData = new FormData();
    formData.append('group_fields', `${JSON.stringify(data)}`)
    formData.append('metaId', this.dataDetailInfo.metaId ? `${this.dataDetailInfo.metaId}` : '')
    formData.append('empId', `${this.dataDetailInfo.empId}`)
    formData.append('meta_type', `${this.dataDetailInfo.meta_type}`)
    formData.append('formFile', this.dataDetailInfo.formFile[0])
    this.apiService.empproFileSetEmpAttach(formData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getEmpPersonalPage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  theFileName(file){
    if(file){
      let fileName = file.split('/')
      .pipe(takeUntil(this.unsubscribe$))
      .pop()
      .pipe(takeUntil(this.unsubscribe$))
      .split('?')[0].split('-uninini-')
      .pipe(takeUntil(this.unsubscribe$))
      .pop();
      return fileName;
    }
  }

  getEmpPersonalPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpPersonalPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data.map(d => {
          return {
            ...d, fileName: this.theFileName(d.meta_file_url)
          }
        }) || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.addEmpPersonal();
    }else {
      this.displayFormEditDetail = false;
      this.getEmpPersonalPage();
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_dinhkem"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.editRow.bind(this),
                label: 'Xem',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.dowloadFileUpload.bind(this),
                label: 'Tải về file đã upload',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
                hide: !params.data.temp_view_url
              },

              {
                onClick: this.delRow.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                key: 'delete-qua-trinh-hop-dong',
                class: 'btn-danger',
              },
            ]
          };
        },
      }
    ];
  }

  dowloadFileUpload({rowData}) {
    this.downloadButtonClicked(rowData.temp_view_url)
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  editRow(event) {
    this.metaId = event.rowData.metaId;
    this.getEmpAttach() 
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này ?',
      accept: () => {
        const queryParams = queryString.stringify({metaId: event.rowData.metaId});
        this.apiService.empproFileDelEmpAttach(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpPersonalPage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}
