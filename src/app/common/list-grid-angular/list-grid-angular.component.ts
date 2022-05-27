import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-grid-angular',
  templateUrl: './list-grid-angular.component.html',
  styleUrls: ['./list-grid-angular.component.css']
})
export class ListGridAngularComponent implements OnInit, OnChanges {
  public modules: Module[] = AllModules;
  @Input() listsData: Array<any> = [];
  @Output() FnClick = new EventEmitter<any>();
  @Output() rowDoubleClicked = new EventEmitter<any>();
  @Output() cellDoubleClicked = new EventEmitter<any>();
  @Output() onCellClicked = new EventEmitter<any>();
  @Output() callback = new EventEmitter<any>();
  @Input() columnDefs: Array<any> = [];
  @Input() rowSelection: string = 'single';
  @Input() frameworkComponents = {};
  @Input() detailCellRendererParams: any;
  @Input() rowClassRules: any;
  @Input() noRowsTemplate: any;
  @Input() pinnedTopRowData: any[] = [];
  @Input() floatingFilter: boolean = false;
  @Input() buttons = [];
  @Input() title: string = '';
  @Input() idGrid: string = 'myGrid';
  // autoHeight
  @Input() defaultColDef: any = {
    tooltipComponent: 'customTooltip',
    resizable: true,
    suppressSorting: false,
    sortable: false,
    suppressSizeToFit: false,
    filter: '',
    rowHeight: 90,
    cellClass: [],
    tooltipComponentParams: { color: '#ececec' },
  };;
  @Input() domLayout: string = '';
  @Input() height: number = 0;
  @Input() heightRow: number = 49;
  @Input() getContextMenuItems: any = null;
  @Input() excelStyles: any[] = [
    {
      id: 'stringType',
      dataType: 'string'
    },
    {
      id: 'dateFormat',
      dataType: 'dateTime',
      numberFormat: { format: 'mm/dd/yyyy;@' },
    },
    {
      id: 'text-right',
      dataType: 'number',
      numberFormat: { format: '#,##0' },
    }
  ];
  sideBar: any
  gridApi: any;
  getRowHeight: any;
  gridColumnApi: any;
  groupDefaultExpanded = 0;
  heightAuto = 0;
  tooltipShowDelay = 0;
  isRowMaster
  titlePage = '';
  excelExportParams
  csvExportParams
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.excelExportParams = {
      fileName: this.titlePage ? this.titlePage : 'export',
      processCellCallback: params => {
        console.log(params)
        if(params.node.data) {
          params.node.data.isContacted = params.node.data.isContacted ? params.node.data.isContacted.split('</span>').shift().split('ml5\">').pop() : '';
          params.node.data.isProfileFull = params.node.data.isProfileFul ?  params.node.data.isProfileFull.split('</span>').shift().split('ml5\">').pop() :'';
          params.node.data.lockName =params.node.data.isProfileFul ? params.node.data.lockName.split('</span>').shift().split('ml5\">').pop(): '';
          params.node.data.status_name =params.node.data.isProfileFul ? params.node.data.status_name.split('</span>').shift().split('ml5\">').pop() : '';
        }
        return params.value
      }
    };
    this.csvExportParams = {
      fileName: this.titlePage ? this.titlePage : 'export'
    };
    this.isRowMaster = (dataItem) => {
      if (dataItem) {
        if (dataItem.Details) {
          return dataItem && dataItem.Details ? dataItem.Details.length > 0 : false;
        } else if (dataItem.orderDetails) {
          return dataItem && dataItem.orderDetails ? dataItem.orderDetails.length > 0 : false;
        } else if (dataItem.details) {
          return dataItem && dataItem.details ? dataItem.details.length > 0 : false;
        } else if (dataItem.submenus) {
          return dataItem && dataItem.submenus ? dataItem.submenus.length > 0 : false;
        } else if (dataItem.stockDiaryDetails) {
          return dataItem && dataItem.stockDiaryDetails ? dataItem.stockDiaryDetails.length > 0 : false;
        } else {
          return false
        }
      } else {
        return false
      }

    };

    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent
    };
    this.tooltipShowDelay = 0

    this.getRowHeight = (params: any) => {

      if (params.node.master || params.node.level === 0) {
        return this.heightRow
      } else {

      }
    };

    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Ẩn hiện cột',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: false,
            suppressValues: false,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
            suppressSyncLayoutWithGrid: true,
            suppressColumnMove: false,
          },
        },
      ],
      defaultToolPanel: '',
    };
  }

  RowDoubleClicked(event) {
    this.rowDoubleClicked.emit(event);
  }

  CellDoubleClicked(event) {
    this.cellDoubleClicked.emit(event);
  }

  CellClicked(event) {
    this.onCellClicked.emit(event);
  }

  ngOnInit(): void {
    var pivotModeOn = document.getElementById(`${this.idGrid}`);
    pivotModeOn?.addEventListener('change', (event: any) => {
      if (event.target.ariaLabel === 'Press SPACE to toggle visibility (visible)' || event.target.ariaLabel === 'Press SPACE to toggle visibility (hidden)') {
        let allColumnIds: any = [];
        this.gridColumnApi.getAllColumns()
          .forEach((column: any) => {
            if (column.colDef.cellClass.indexOf('no-auto') < 0) {
              allColumnIds.push(column)
            } else {
              column.colDef.resizable = false;
            }
          });
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
        this.autoSizeAll()
      } else if (event.target.ariaLabel === 'Press Space to toggle row selection (checked)'
        || event.target.ariaLabel === 'Press Space to toggle row selection (unchecked)'
        || event.target.ariaLabel === 'Press Space to toggle all rows selection (checked)'
        || event.target.ariaLabel === 'Press Space to toggle all rows selection (unchecked)') {
      }
    })
  }

  onRowSelected(e) {
    this.callback.emit(this.gridApi.getSelectedRows())
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    let allColumnIds: any = [];
    this.gridColumnApi.getAllColumns()
      .forEach((column: any) => {
        allColumnIds.push(column)
      });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
   
  }

  ngOnChanges() {
    // this.heightAuto = this.listsData.length > 0 ? 50 + (this.listsData.length === 1 ? 80 : 60 * this.listsData.length) : 100;
    this.heightAuto = this.height;
    // this.heightAuto = this.heightAuto < 660 ? this.heightAuto : 660
  }

  sizeToFit() {
    if (this.gridApi) {
      let allColumnIds: any = [];
      this.gridColumnApi.getAllColumns()
        .forEach((column: any) => {
          if (column.colDef.cellClass.indexOf('no-auto') < 0) {
            allColumnIds.push(column)
          } else {
            column.colDef.suppressSizeToFit = true;
            allColumnIds.push(column)
          }
        });
      this.gridApi.sizeColumnsToFit(allColumnIds);
    }
  }

  getDataAsExcel(event) {
    console.log(event)

  }

  autoSizeAll() {
    if (this.gridColumnApi) {
      if (this.gridColumnApi.columnModel.scrollWidth > this.gridColumnApi.columnModel.bodyWidth) {
        this.sizeToFit();
      } else {
        let allColumnIds: any = [];
        this.gridColumnApi.getAllColumns()
          .forEach((column: any) => {
            if (column.colDef.cellClass.indexOf('no-auto') < 0) {
              allColumnIds.push(column)
            } else {
              column.colDef.resizable = false;
            }
          });
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      }
    }
  }


  OnClick(event: any) {
    this.FnClick.emit(event);
  }

  create(label: any) {
    this.callback.emit(label);
  }

  cellClicked(event) {
    if (event.colDef.field === 'meta_file_name') {
      this.downloadButtonClicked(event.data.meta_file_url)
    }
  }

  downloadButtonClicked(urlLink) {
    var url = urlLink;
    var elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
  }

  handleScroll(event: any) {
    if (this.gridColumnApi) {
      let allColumnIds: any = [];
      this.gridColumnApi.getAllColumns()
        .forEach((column: any) => {
          if (column.colDef.cellClass.indexOf('no-auto') < 0) {
            allColumnIds.push(column)
          } else {
            column.colDef.resizable = false;
          }
        });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      const grid = document.getElementById(`${this.idGrid}`);
      if (grid) {
        const gridBody = grid.querySelector('.ag-body-viewport') as any;
        this.autoSizeAll();
      }
    }

  }

}
