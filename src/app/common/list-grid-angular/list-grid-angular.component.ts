import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
import { ActivatedRoute } from '@angular/router';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { cloneDeep } from 'lodash';
import { MessageService } from 'primeng/api';
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
  @Output() firstDataRendered = new EventEmitter<any>();
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
  @Input() isShowButton: boolean = false;
  @Input() title: string = '';
  @Input() idGrid: string = 'myGrid';
  @Input() typeConfig: string = 'myGrid';
  isRowSelectable;
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
  @Input() heightRow: number = 40;
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
  csvExportParams;
  listsDataCloone = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,

  ) {
    this.isRowSelectable = (rowNode) => {
      return rowNode.data.tontai ? false : true;
    };
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.excelExportParams = {
      fileName: this.titlePage ? this.titlePage : 'export',
      processCellCallback: params => {
        console.log(params)
        if (params.node.data) {
          params.node.data.isContacted = params.node.data.isContacted ? params.node.data.isContacted.split('</span>').shift().split('ml5\">').pop() : '';
          params.node.data.isProfileFull = params.node.data.isProfileFul ? params.node.data.isProfileFull.split('</span>').shift().split('ml5\">').pop() : '';
          params.node.data.lockName = params.node.data.isProfileFul ? params.node.data.lockName.split('</span>').shift().split('ml5\">').pop() : '';
          params.node.data.status_name = params.node.data.isProfileFul ? params.node.data.status_name.split('</span>').shift().split('ml5\">').pop() : '';
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
        }else if (dataItem.contractFiles) {
          return dataItem && dataItem.contractFiles ? dataItem.contractFiles.length > 0 : false;
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
      avatarRendererFull: AvatarFullComponent,
      buttonRendererComponent: ButtonRendererComponent
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

  onFirstDataRendered(event) {
    this.firstDataRendered.emit(event);
  }
  CellDoubleClicked(event) {
    this.cellDoubleClicked.emit(event);
  }

  CellClicked(event) {
    this.onCellClicked.emit(event);
  }

  ngOnInit(): void {
    this.listsDataCloone = cloneDeep(this.listsData);
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
  dataChange = null;
  onRowSelected(event) {
    if (!event.node.isSelected() && this.isChange) {
      this.dataChange = event.data;
      if(this.typeConfig === 'FormInfo') {
        this.callApiForm();
      }else {
        this.callApi();
      }
    }
    this.callback.emit(this.gridApi.getSelectedRows())
  }

  // xem lại
  callApiForm() {
    if (this.listsDataCloone.map(d => d.field_name).indexOf(this.dataChange.field_name) < 0) { 
      for (let key in this.dataChange) {
        if (key === 'isSpecial' || key === 'isRequire' || key === 'isDisable' || key === 'isVisiable' || key === 'hideInApp' || key === 'isChange' || key === 'isEmpty') {
          this.dataChange[key] = this.dataChange[key] == 1 || this.dataChange[key] == true ? true : false
        }
      }
      this.setGridViewInfo();
    }else {
      let items = this.listsData.filter(d => d.field_name === this.dataChange.field_name);
      if(items.length > 1) {
        let index = this.listsData.findIndex(d => d.id === this.dataChange.id);
        this.listsData.splice(index, 1);
        this.listsData = [...this.listsData];
        this.dataChange = null;
        this.isChange = false;
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Đã tồn tại tên trường !"});
      }else {
        for (let key in this.dataChange) {
          if (key === 'isSpecial' || key === 'isRequire' || key === 'isDisable' || key === 'isVisiable' || key === 'hideInApp' || key === 'isChange' || key === 'isEmpty') {
            this.dataChange[key] = this.dataChange[key] == 1 || this.dataChange[key] == true ? true : false
          }
        }
        this.setGridViewInfo();
      }
    }
  }

  callApi() {
    if (this.listsDataCloone.map(d => d.columnField).indexOf(this.dataChange.columnField) < 0) {
      for (let key in this.dataChange) {
        if (key === 'isUsed' || key === 'isHide' || key === 'isFilter' || key === 'isMasterDetail' || key === 'isStatusLable') {
          this.dataChange[key] = this.dataChange[key] == 1 || this.dataChange[key] == true ? true : false
        }
      }
      this.setGridViewInfo();
    }else {
      let items = this.listsData.filter(d => d.columnField === this.dataChange.columnField);
      if(items.length > 1) {
        let index = this.listsData.findIndex(d => d.id === this.dataChange.id);
        this.listsData.splice(index, 1);
        this.listsData = [...this.listsData];
        this.dataChange = null;
        this.isChange = false;
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Đã tồn tại tên trường !"});
      }else {
        for (let key in this.dataChange) {
          if (key === 'isUsed' || key === 'isHide' || key === 'isFilter' || key === 'isMasterDetail' || key === 'isStatusLable') {
            this.dataChange[key] = this.dataChange[key] == 1 || this.dataChange[key] == true ? true : false
          }
        }
        this.setGridViewInfo();
      }
    }
  }

  setGridViewInfo() {
    this.spinner.show();
    this.apiService.setGridViewInfo(this.typeConfig === 'FormInfo' ? 'SetFormViewInfo' : 'SetGridViewInfo', this.dataChange).subscribe(results => {
      if (results.status === 'success') {
        this.listsDataCloone = [];
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thành công' });
        this.isChange = false;
        this.listsData = [...this.listsData];
        this.listsDataCloone = cloneDeep(this.listsData);
        this.dataChange = null;
        // this.doubleClicked.emit()
        this.spinner.hide();
      } else {
        setTimeout(() => {
          let index = this.listsData.findIndex(d => d.id === this.dataChange.id)
          this.gridApi.setFocusedCell(index, 'columnCaption');
          this.gridApi.startEditingCell({
            rowIndex: index,
            colKey: 'columnCaption',
          });
          this.dataChange = null;
        }, 500);
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    })
  }


  isChange = false
  onCellValueChanged(event) {
    console.log(event)
    console.log(event.value != event.oldValue)
    if (event.value != event.oldValue) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    let allColumnIds: any = [];
    this.gridColumnApi.getAllColumns()
    .forEach((column: any) => {
      if (column && column.colDef.cellClass && column.colDef.cellClass.length > 0 && column.colDef.cellClass.indexOf('no-auto') < 0) {
        allColumnIds.push(column)
      } else {
        column.colDef.resizable = false;
      }
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

  addRow() {

  }

}
