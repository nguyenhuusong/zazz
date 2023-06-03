import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { AgGridFn, TextFormatter } from 'src/app/common/function-common/common';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'tang-giam',
  templateUrl: './tang-giam.component.html',
  styleUrls: ['./tang-giam.component.scss']
})
export class TangGiamComponent implements OnInit {
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
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';
  colsDetail = [];
  detailCellRendererParams = null;
  listDataNew = [];
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    recordId: null
  };
  gridflexs =[];
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  first = 0;
  ngOnInit(): void {
    this.query.recordId = this.recordId;
    this.getSalaryTransPage();
  }

  cauhinh() {
    this.displaySetting = true;
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
    
  
  paginate(event): void {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.getSalaryTransPage();
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight  + e.clientHeight + 110;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  selectedStatus = null;
  UpdateStatus() {
    // this.getSalaryRecordInfo(this.selectedStatus.value);
  }
  menuActions = []

  callActions(code) {
    this[code]();
  }

  initButton(data) {
    this.menuActions = data.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this.callActions(item.code);
        }
      }
    });
  }

  onBack() {
    this.router.navigate(['/chinh-sach/tien-luong'])
  }
  status = [];
  getSalaryTransPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ ...this.query});
    this.apiService.getSalaryTransPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList;
        this.gridKey= results.data.gridKey;
        if (this.query.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.status = results.data.flowStatuses || [];
        if (results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if (results.data.actions) {
          this.initButton(results.data);
        }

        this.initGrid();
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.totalRecord = results.data.recordsTotal;
        this.countRecord.currentRecordStart = results.data.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs || []),
      
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
      //           label: 'Xem',
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
