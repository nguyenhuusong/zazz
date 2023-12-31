import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { finalize } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import * as queryString from 'querystring';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as moment from 'moment';

@Component({
  selector: 'app-loai-bieu-mau',
  templateUrl: './loai-bieu-mau.component.html',
  styleUrls: ['./loai-bieu-mau.component.scss']
})
export class LoaiBieuMauComponent implements OnInit, AfterViewChecked {
  items = [];
  organs = [];
  loadjs = 0;
  heightGrid = 0;
  query = {
    filter: '',
    organizeId: '',
    typeForm: null,
    createDate: '',
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
    this.getAgencyOrganizeMap();
    this.getOrgan();
    this.getFormTypes();
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

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
    this.getAgencyOrganizeMap(true);
  }

  getAgencyOrganizeMap(type = false) {
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          // this.query.organizeId = this.selectedNode.orgId;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          // this.query.organizeId = this.selectedNode?.orgId;
          this.listAgencyMap = this.expanded(this.listAgencyMap, this.selectedNode.parentId)
          this.selected(this.listAgencyMap, this.query.organizeId);
          if (type) {
            this.isHrDiagram = true;
          }
          this.load();
        }
      }
    })
  }

  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    localStorage.setItem('organize', JSON.stringify(event.node));
    // this.query.orgId = this.selectedNode?.orgId;
    this.query.organizeId = this.detailOrganizeMap?.orgId;
    this.isHrDiagram = false;
    this.load()
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

  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organs = results.data.map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        this.organs = [...this.organs];
      }
    })
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
    if (query.createDate && typeof query.createDate !== 'string') {
      query.createDate = moment(query.createDate).format('YYYY-MM-DD');
    }
    if (typeof this.query.typeForm === 'object' && this.query && this.query.typeForm) {
      query.typeForm = this.query.typeForm.data;
    } 
    const queryParams = queryString.stringify(query);
    this.apiService.getFormsTypePage(queryParams)
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
    console.log('event event event', event)
    return {
      buttons: [
        {
          onClick: this.handleEdit.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: event.data.is_edit !== 1
        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa tài liệu',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: event.data.is_edit !== 1
        },
      ]
    };
  }

  handleDelete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tài liệu?',
      accept: () => {
        const queryParams = queryString.stringify({formId: event.rowData.form_type_id});
        this.apiService.delFormsTypeInfo(queryParams).subscribe((results: any) => {
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

  handleEdit(event) {
    this.formTypeId = event.rowData.form_type_id;
    this.addNewPopup = true;
  }

  handleAdd(): void {
    this.formTypeId = null;
    this.addNewPopup = true;
  }

  initGrid() {
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
        headerName: 'Thao tác',
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
    this.apiService.getFormPage(queryParams).subscribe(
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
      organizeId: '',
      filter: '',
      typeForm: '',
      createDate: '',
      offSet: 0,
      pageSize: 10
    }
    this.load();
  }

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
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
    console.log('fdjosfjidso')
  }
}
