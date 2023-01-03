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
  selector: 'app-thanh-phan-luong',
  templateUrl: './thanh-phan-luong.component.html',
  styleUrls: ['./thanh-phan-luong.component.scss']
})
export class ThanhPhanLuongComponent implements OnInit {
  @Input() salaryInfoId = null;
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
 
  ngOnInit(): void {
    this.getSalaryComponentPageV1();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }

  getSalaryComponentPageV1() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ salaryInfoId: this.salaryInfoId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalaryComponentPageV1(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }
 

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      // {
      //   headerComponentParams: {
      //     template:
      //     `<button  class="btn-button" id="${this.gridKey}_kynang"> <span class="pi pi-plus action-grid-add" ></span></button>`,
      //   },
      //   field: 'gridflexdetails1',
      //   cellClass: ['border-right', 'no-auto'],
      //   pinned: 'right',
      //   width: 70,
      //   cellRenderer: 'buttonAgGridComponent',
      //   cellRendererParams: params => {
      //     return {
      //       buttons: [
      //         {
      //           onClick: this.editRow.bind(this),
      //           label: 'Xem chi tiết',
      //           icon: 'fa fa-edit editing',
      //           key: 'view-job-detail',
      //           class: 'btn-primary mr5',
      //         },

      //         {
      //           onClick: this.delRow.bind(this),
      //           label: 'Xóa',
      //           icon: 'pi pi-trash',
      //           key: 'delete-qua-trinh-hop-dong',
      //           class: 'btn-danger',
      //         },
      //       ]
      //     };
      //   },
      // }
    ];
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  trainId = null;
  editRow({rowData}) {
    this.trainId = rowData.metaId
    this.getTrainFile();
  }

  getTrainFile() {
    // this.spinner.show();
    // const queryParams = queryString.stringify({ trainId: this.trainId });
    // this.listViewsDetail = [];
    // this.apiService.getTrainFile(queryParams).subscribe(result => {
    //   if (result.status === 'success') {
    //     this.listViewsDetail = cloneDeep(result.data.group_fields);
    //     this.dataDetailInfo = result.data;
    //     this.displayFormEditDetail = true;
    //     this.spinner.hide();
    //   } else {
    //     this.spinner.hide();
    //   }
    // })
  }

  delRow(event) {
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
    //   accept: () => {
    //     const queryParams = queryString.stringify({trainId: event.rowData.trainId});
    //     this.apiService.delTrainFile(queryParams).subscribe((results: any) => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
    //         this.getSalaryComponentPageV1();
    //         this.FnEvent();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  getFilesDetail(event) {
    this.files = event;
  }

}
