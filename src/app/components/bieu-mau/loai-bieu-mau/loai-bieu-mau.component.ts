import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { finalize, Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import * as queryString from 'querystring';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { cloneDeep } from 'lodash';
import { fromEvent, takeUntil } from 'rxjs';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-loai-bieu-mau',
  templateUrl: './loai-bieu-mau.component.html',
  styleUrls: ['./loai-bieu-mau.component.scss']
})
export class LoaiBieuMauComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  items = [];
  loadjs = 0;
  heightGrid = 0;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 15
  };
  cols: any[];
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  listsData = [];
  columnDefs = [];
  detailCellRendererParams;
  colsDetail: any[];
  employeeStatus = [];
  listDataSelect = [];
  isHrDiagram: boolean = false
  selectedNode;
  listAgencyMap: TreeNode[];
  organizeList = []
  detailOrganizeMap = null;
  formTypes = [];

  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    public dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Hoạt động' },
      { label: '...' },
      { label: 'Tài liệu', routerLink: '/chinh-sach/tai-lieu-chung' },
      { label: 'Thiết lập loại tài liệu' },
    ];
    this.getFormTypes();
    this.getFilter();
  }

  getNode(item) {
    return {
      label: item.formTypeName || item.formTypeId,
      data: item.formTypeId,
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder",
      children: item.children
    };
  }

  loopEveryNodeTree(list): void {
    for (let i = 0; i < list.length; i++) {
        if (Array.isArray(list[i].children) && list[i].children.length) {
          list[i] = this.getNode(list[i]);
          this.loopEveryNodeTree(list[i].children);
        } else {
          list[i] = this.getNode(list[i]);
        }
    }
  }


  getFormTypes(): void {
    const queryParams = queryString.stringify({ filter: '', form_type_id: ''})
    this.apiService.getFormsTypes(queryParams)
    .pipe(
      finalize(() => this.spinner.hide())
    )
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(response => {
      if (response.status === 'success') {
        const data = response.data;
        this.loopEveryNodeTree(data)
        this.formTypes = data
      } else {
        console.error(response.message);
      }
    })
  }

  selected(datas = [], orgId = '') {
    datas.forEach(d => {
      if (d.orgId == orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }


  expanded(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        d.expanded = true;
      } else {
        if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
      }
      d.children.forEach((elm: { children: { expanded: boolean; }[]; expanded: boolean; }) => {
        elm.children.forEach((e: { expanded: boolean; }) =>{
          if (e.expanded === true) {
            elm.expanded = true
          }
        })
      });      
    })
    return datas
  }

  find() {
    this.load();
  }

  
  changePageSize() {
    this.load();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    this.spinner.show();
    const query = {...this.query};
    const queryParams = queryString.stringify(query);
    this.apiService.getFormTypeTreePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
          }, 100);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: this.CheckHideSua(event)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa tài liệu',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: this.CheckHideXoa(event)
        },
      ]
    };
  }

  CheckHideSua(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetFormsTypePage.url, ACTIONS.VIEW);
    if(checkValue) {
      return true;
    }else {
      if(event.data.is_edit !== 1) {
        return true;
      }else {
        return false;
      }
    }
  }

  CheckHideXoa(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetFormsTypePage.url, ACTIONS.DELETE);
    if(checkValue) {
      return true;
    }else {
      if(event.data.is_edit !== 1) {
        return true;
      }else {
        return false;
      }
    }
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tài liệu?',
      accept: () => {
        const queryParams = queryString.stringify({formId: event.rowData.form_type_id});
        this.apiService.delFormsTypeInfo(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa tài liệu thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  editRow({rowData}) {
    this.formTypeId = rowData.form_type_id;
    this.addNewPopup = true;
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  handleAdd(): void {
    this.formTypeId = null;
    this.addNewPopup = true;
  }
  getDataPath = null;
  autoGroupColumnDef = null;
  initGrid() {
    this.autoGroupColumnDef = {
      headerName: 'Tên loại tài liệu',
      cellClass: [ 'no-auto'],
      minWidth: 400,
      cellRendererParams: {
        suppressCount: true,
      },
    }
    this.getDataPath = (data) => {
      return data.orgHierarchy;
    };
    this.columnDefs = [
      {
        headerName: 'Stt',
        filter: '',
        maxWidth: 120,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        maxWidth: 120,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]

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
        params.successCallback(params.data.AgencyGenerals);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.AgencyGenerals.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  exportExel() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.getFormPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        const dataExport = [];
        let gridflexs = results.data.gridflexs;
        let arrKey = gridflexs.map(elementName => elementName.columnField);

        let dataList = results.data.dataList.data;
        for (let elementValue of dataList) {
          const data: any = {};
          for (let elementName of gridflexs) {
            if (arrKey.indexOf(elementName.columnField) > -1 && !elementName.isHide && elementName.columnField !== 'statusName') {
              let valueColumn = elementValue[elementName.columnField];
              if (elementName.columnField == 'status_name' || elementName.columnField == 'isContacted' || elementName.columnField == 'isProfileFull' || elementName.columnField == 'lockName') {
                valueColumn = this.replaceHtmlToText(valueColumn);
              }
              data[elementName.columnCaption] = valueColumn || '';
            }

          }

          dataExport.push(data);
        }
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách hồ sơ nhân sự ' + new Date());

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 10
    }
    this.load();
  }

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
    this.changeDetector.detectChanges();
  }

  rowSelected(data) {
    this.listDataSelect = data
  }

  addNewPopup = false;
  formTypeId = null;
  handleCallbackForm() {
    this.load();
    this.addNewPopup = false;
  }

  //filter 
  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  getFilter() {
    this.apiService.getFilter('/api/v1/eating/GetEatingFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

   filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
  }

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.query = { ...this.query, ...params};
      this.load();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.handleAdd()
        });
      }
    }, 300);
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
