import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AgGridFn, TextFormatter } from 'src/app/common/function-common/common';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-tab-ngay-cong',
  templateUrl: './tab-ngay-cong.component.html',
  styleUrls: ['./tab-ngay-cong.component.scss']
})
export class TabNgayCongComponent implements OnInit {
  @Input() recordId = null;
  @Input() detailInfo = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  cellRendererSanPham: any;
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';

 
  listDataNew = [];
  ngOnInit(): void {
    this.listsData = cloneDeep(this.detailInfo.monthdays);
    this.listDataNew =this.listsData;
    this.columnDefs = [...this.agGridFnCustomer(this.detailInfo.gridflexs1 || [])]
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  agGridFnCustomer(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
     let row = {
        headerName: value.columnCaption,
        field: value.columnField,
        cellClass: value.cellClass,
        filter: value.isFilter ? 'agSetColumnFilter' : '',
        sortable: false,
        filterParams: {
          caseSensitive: true,
          textFormatter:  (r) => TextFormatter(r),
          cellRenderer:  this.cellRendererSanPham,
        },
        cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
        hide: value.isHide ? true : false,
        pinned: value.pinned,
        tooltipField: value.columnField,
        headerTooltip: value.columnCaption
        // valueFormatter: value.fieldType == 'decimal' ? ""
    }
        arrAgGrids.push(row);
    }
    return arrAgGrids
}


}
