import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-ho-so',
  templateUrl: './ho-so.component.html',
  styleUrls: ['./ho-so.component.scss']
})
export class HoSoComponent implements OnInit {
  @Input() terminateId = null;
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
  files = null

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_worked`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addWorked()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getTerminateMetaPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  metaId = null;
  addWorked() {
    this.metaId = null;
    this.getEmpAttachInsur();
  }

  listViewsDetail = [];
  dataDetailInfo = null;
  displayFormEditDetail = false
  getEmpAttachInsur() {
    const queryParams = queryString.stringify({ terminateId: this.terminateId, metaId: this.metaId});
    this.listViewsDetail = [];
    this.apiService.getEmpAttachInsur(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }
  getFilesDetail(event) {
    this.files = event;
  }

  setDetailInfo(data) {
    if(this.files && this.files.length > 0){
      data[0].fields.forEach(element => {
        if(element.field_name === "meta_file_size") {
          element.columnValue = this.files[0].size
        }else if(element.field_name === "meta_file_type") {
          element.columnValue = this.files[0].type;
        }
        else if(element.field_name === "meta_file_name") {
          element.columnValue = this.files[0].name;
        }
      });
    }
    const param = {
      ...this.dataDetailInfo, group_fields: data
    }
    this.apiService.setEmpAttachInsur(param).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getTerminateMetaPage();
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
      let fileName = file.split('/').pop().split('?')[0].split('-uninini-').pop();
      return fileName;
    }
  }
  
  getTerminateMetaPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ terminateId: this.terminateId, offSet: 0, pageSize: 10000 });
    this.apiService.getTerminateMetaPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data;
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.getEmpAttachInsur();
    }else {
      this.displayFormEditDetail = false
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        // headerComponentParams: {
        //   template:
        //   `<button  class="btn-button" id="${this.gridKey}_worked"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        // },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              // {
              //   onClick: this.editRow.bind(this),
              //   label: 'Xem chi tiết',
              //   icon: 'fa fa-edit editing',
              //   key: 'view-job-detail',
              //   class: 'btn-primary mr5',
              // },

              // {
              //   onClick: this.delRow.bind(this),
              //   label: 'Xóa',
              //   icon: 'pi pi-trash',
              //   key: 'delete-qua-trinh-hop-dong',
              //   class: 'btn-danger',
              // },
            ]
          };
        },
      }
    ];
  }

  editRow({rowData}) {
    this.metaId = rowData.metaId;
    this.getEmpAttachInsur();
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }


  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        const queryParams = queryString.stringify({metaId: event.rowData.metaId});
        this.apiService.delEmpAttachInsur(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.getTerminateMetaPage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

}