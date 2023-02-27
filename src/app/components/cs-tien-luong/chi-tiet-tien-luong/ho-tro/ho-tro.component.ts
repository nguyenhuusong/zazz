import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { AgGridFn, TextFormatter } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-ho-tro',
  templateUrl: './ho-tro.component.html',
  styleUrls: ['./ho-tro.component.scss']
})
export class HoTroComponent implements OnInit {
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
  colsDetail = [];
  detailCellRendererParams = null;
  listDataNew = [];
  ngOnInit(): void {
    this.getSalarySupportPage();
  }

  cauhinh() {
    this.displaySetting = true;
  }
  
  getSalarySupportPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ recordId: this.recordId, offSet: 0, pageSize: 10000 });
    this.apiService.getSalarySupportPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
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
      //     `<button  class="btn-button" id="${this.gridKey}_chungchi"> <span class="pi pi-plus action-grid-add" ></span></button>`,
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
    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.workdays);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.work_times;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.workdays.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
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
