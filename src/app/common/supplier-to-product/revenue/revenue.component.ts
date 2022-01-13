import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
const queryString = require('query-string');
import { formatMargin, FormatNumberCurrency, onProcessValue } from 'src/app/utils/common/function-common';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
import { TooltipSuggestionComponent } from 'src/app/utils/common/tooltip-suggestion.component';
import * as moment from 'moment';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  @Input() modelRevenue: any;
  @Output() changeDate = new EventEmitter<any>();
  public modules: Module[] = AllModules;
  query = {
    filter: '', storeId: '', from_date: '', to_date: '', productId: '', offSet: 0, pageSize: 100000000
  };
  queryDetail = {
    filter: '',
    storeId: '',
    product_id: '',
    product_name: '',
    unit_id: '',
    barcode: '',
    from_date: moment(new Date()).format('YYYY-MM-DD'),
    to_date: moment(new Date()).format('YYYY-MM-DD'),
    offSet: 0,
    pageSize: 0
  };
  fromDateDetail: Date;
  toDateDetail: Date;
  formatNumberCurrency = FormatNumberCurrency;
  columnDefs= [];
  detailRowHeight;
  defaultColDef;
  defaultDetailColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  gridColumnApi: any;
  countRecord: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  countRecordDetail: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  columnDefsDetail;
  gridApiDetail;
  gridColumnApiDetail;
  displaydetailreport = false;
  dataDetails = [];
  items = [];
  totalRecords = 0;
  first = 0;
  onProcessValue = onProcessValue;
  constructor(
    private apiSmart: ApiSmartService
  ) {
    this.defaultColDef = {
      resizable: true,
      cellClass: ['border-right'],
      tooltipComponent: 'tooltipSuggestion',
      tooltipComponentParams: {content: 'Nhấn đúp để xem chi tiết'}
    };
    this.defaultDetailColDef = {
      resizable: true,
      cellClass: ['border-right'],
      tooltipComponent: 'customTooltip'
    };
    this.getRowHeight = (params) => {
      return 50;
    };

    this.frameworkComponents = {
      buttonRenderer1: ButtonRendererComponent,
      customTooltip: CustomTooltipComponent,
      tooltipSuggestion: TooltipSuggestionComponent
    };
   }

  ngOnInit(): void {
    this.query.storeId = this.modelRevenue.storeId;
    this.query.productId = this.modelRevenue.productId;
    this.query.from_date = moment(this.modelRevenue.fromDate).format('YYYY-MM-DD');
    this.query.to_date = moment(this.modelRevenue.toDate).format('YYYY-MM-DD');
    this.initGrid();
    this.initGridDetail();
    this.getRevenueReport();
  }

  getRevenueReport() {
    const queryParams = queryString.stringify(this.query);
    if (this.query.storeId !== '') {
      this.apiSmart.getRevenueReport(queryParams)
      .subscribe(result => {
        this.items = result.data.dataList;
        setTimeout(() => {
          if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
          }
        }, 200);
        this.totalRecords = result.recordsTotal;
        this.countRecord.totalRecord = result.recordsTotal;
        this.countRecord.currentRecordStart = this.countRecord.totalRecord === 0 ? this.query.offSet + 0 : this.query.offSet + 1;
        if ((result.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = result.recordsTotal;
        }
      });
    }
  }

  detectChange(key, event) {
    if (key === 'from_date') {
      this.query.from_date = moment(event).format('YYYY-MM-DD');
      this.getRevenueReport();
    }

    if (key === 'to_date') {
      this.query.to_date = moment(event).format('YYYY-MM-DD');
      this.getRevenueReport();
    }

    this.changeDate.emit({
      fromDate: moment(this.query.from_date).toDate(),
      toDate: moment(this.query.to_date).toDate()
    });
  }

  detectChangeDetail(key, event) {
    if (key === 'from_date') {
      this.queryDetail.from_date = moment(event).format('YYYY-MM-DD');
      this.getReportRevenueDetail();
    }

    if (key === 'to_date') {
      this.queryDetail.to_date = moment(event).format('YYYY-MM-DD');
      this.getReportRevenueDetail();
    }

    this.changeDate.emit({
      fromDate: moment(this.queryDetail.from_date).toDate(),
      toDate: moment(this.queryDetail.to_date).toDate()
    });
  }


  onGridReadyDetail(params) {
    this.gridApiDetail = params.api;
    this.gridColumnApiDetail = params.columnApi;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRenderer(params) {
    params.api.sizeColumnsToFit();
  }
  onFirstDataRendererdetail(params) {
    params.api.sizeColumnsToFit();
  }

  changePageSize() {
    this.getRevenueReport();
  }

  cellDoubleClicked(e) {
    this.queryDetail.unit_id = e.data.unit_id;
    this.queryDetail.product_id = e.data.product_id;
    this.queryDetail.product_name = e.data.product_name;
    this.queryDetail.barcode = e.data.bar_code;
    this.queryDetail.from_date = this.query.from_date;
    this.queryDetail.storeId = this.modelRevenue.storeId;
    this.queryDetail.to_date = this.query.to_date;
    this.fromDateDetail = this.modelRevenue.fromDate;
    this.toDateDetail = this.modelRevenue.toDate;
    this.getReportRevenueDetail();
  }

  getReportRevenueDetail() {
    const params = {... this.queryDetail};
    params.offSet = 0;
    params.pageSize = 100000;
    delete params.product_name;
    const queryParams = queryString.stringify(params);
    this.apiSmart.getReportRevenueDetail(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.dataDetails  = results.data;
        this.displaydetailreport = true;
        setTimeout(() => {
          this.gridApiDetail.sizeColumnsToFit();
        }, 100);
      }
    });
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getRevenueReport();
  }

  initGridDetail() {
    this.columnDefsDetail = [
      {
        headerName: 'Tên HH',
        field: 'product_name',
        width: 500,
        tooltipField: 'product_name'
      },
      {
        headerName: 'Mã hàng',
        field: 'bar_code',
        tooltipField: 'bar_code'
      },
      {
        headerName: 'Đơn vị',
        field: 'unit_name',
        tooltipField: 'unit_name'
      },
      {
        headerName: 'Số hóa đơn',
        field: 'stock_no',
        minWidth: 180,
        tooltipField: 'stock_no'
      },
      {
        headerName: 'Ngày xuất hàng',
        field: 'stock_date',
        tooltipField: 'stock_date'
      },
      {
        headerName: 'Số lượng',
        field: 'quantity',
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'quantity'
      },
      {
        headerName: 'Đơn giá',
        field: 'price',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'price'
      },
      {
        headerName: 'Thành tiền',
        field: 'amount',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'amount'
      },
    ]

  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'Mã hàng',
        field: 'bar_code',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        cellStyle: {
          'font-weight': '500',
        },
        tooltipField: 'bar_code'
      },
      {
        headerName: 'Tên hàng',
        field: 'product_name',
        headerClass: ['cl6dabe8', 'text-center'],
        width: 500,
        cellStyle: {
          'font-weight': '500'
        },
        tooltipField: 'product_name'
      },
      // {
      //   headerName: 'Mã nhóm',
      //   headerClass: ['cl6dabe8', 'text-center'],
      //   field: 'category_code',
      //   cellStyle: {
      //     'font-weight': '500'
      //   },
      //   tooltipField: 'category_code'
      // },
      // {
      //   headerName: 'Tên nhóm',
      //   field: 'category_name',
      //   headerClass: ['cl6dabe8', 'text-center'],
      //   cellStyle: {
      //     'font-weight': '500'
      //   },
      //   tooltipField: 'category_name'
      // },
      {
        headerName: 'SL bán',
        field: 'sell_quantity',
        headerClass: ['clad5e7f', 'text-center'],
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'sell_quantity'
      },
      {
        headerName: 'Doanh thu',
        field: 'revenue',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        headerClass: ['clad5e7f', 'text-center'],
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'revenue'
      },
      {
        headerName: 'SL trả',
        field: 'return_quantity',
        headerClass: ['clebb878', 'text-center'],
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'return_quantity'
      },
      {
        headerName: 'Giá trị trả',
        field: 'return_amount',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        headerClass: ['clebb878', 'text-center'],
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'return_amount'
      },
      {
        headerName: 'Doanh thu thuần',
        field: 'net_revenue',
        headerClass: ['cl8bd46a', 'text-center'],
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'net_revenue'
      },
      {
        headerName: 'Tổng giá vốn',
        field: 'cost_amount',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        headerClass: ['cl8bd46a', 'text-center'],
        cellClass: ['text-right','text-number', 'border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'cost_amount'
      },
      {
        headerName: 'Lợi nhuận',
        field: 'profit',
        headerClass: ['cl8bd46a', 'text-center', 'text-number'],
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellClass: ['border-right'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'profit'
      },
      {
        headerName: 'Margin(%)',
        field: 'margin',
        headerClass: ['cl6dabe8', 'text-center', 'text-number'],
        cellClassRules: {
          hlValue: 'x > 0'
        },
        cellStyle: {
          'font-weight': '500',
           textAlign: 'right',
        },
        // tooltipField: 'margin',
        valueFormatter: formatMargin
      },
    ];
  }

}
