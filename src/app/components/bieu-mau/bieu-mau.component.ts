import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService, TreeNode } from 'primeng/api';
import { ExportFileService } from './../../services/export-file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import * as queryString from 'querystring';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import {
  FirstDataRenderedEvent,
} from '@ag-grid-community/core';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
@Component({
  selector: 'app-bieu-mau',
  templateUrl: './bieu-mau.component.html',
  styleUrls: ['./bieu-mau.component.scss']
})
export class BieuMauComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  items = [];
  organs = [];
  loadjs = 0;
  heightGrid = 300;
  query = {
    filter: '',
    organizeId: '',
    typeForm: null,
    createDate: '',
    offSet: 0,
    pageSize: 15,
    form_status: null,
    organizeIds: '',
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
  statusTaiLieu = [
    { label: 'Đang hoạt động', value: 1 },
    { label: 'Hết hạn', value: 2 },
    { label: 'Đã lên app', value: 3 }
  ]
  detailCellRendererParams;
  colsDetail: any[];
  listDataSelect = [];
  isHrDiagram: boolean = false
  selectedNode;
  listAgencyMap: TreeNode[];
  organizeList = []
  detailOrganizeMap = null;
  formTypes = [];
  data=[];
  formId = null;
  dataRouter = null;
  indexTab = 0;
  titleHeader = '';
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
    private router: Router,
    public dialogService: DialogService,
    private route: ActivatedRoute
  ) {
    this.dataRouter = this.route.data['_value'];
   }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = results;
          this.load();
        }
    });
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Hoạt động' },
      { label: 'Tài liệu' },
      { label: this.dataRouter.title },
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

  selectedNode11(event) {
    // this.query.typeForm = event.node.data
    // this.load();
  }

  getFormTypes(): void { 
    const queryParams = queryString.stringify({ filter: '', form_type_id: ''})
    this.apiService.getFormsTypes(queryParams)
    .pipe(
      finalize(() => this.spinner.hide())
    )
    .subscribe(response => {
      const data = response.data;
      this.loopEveryNodeTree(data);
      this.formTypes = data;
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
        if (localStorage.getItem("organize") === null || localStorage.getItem("organize") === 'undefined') {
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
    this.listDataSelect = []
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
    this.apiService.getFormGeneral(queryParams, this.indexTab === 0 ? 'GetFormGeneral' : 'GetFormPersonal').subscribe(
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
          onClick: this.EditEmployee.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: this.indexTab === 0 || CheckHideAction(MENUACTIONROLEAPI.GetFormGeneral.url, ACTIONS.VIEW)

        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa tài liệu',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: this.indexTab === 0 || CheckHideAction(MENUACTIONROLEAPI.GetFormGeneral.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  handleDelete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tài liệu?',
      accept: () => {
        const queryParams = queryString.stringify({formId: event.rowData.form_id});
        this.apiService.delFormsInfo(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa tài liệu thành công!' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  EditEmployee(event) {
    // this.router.navigateByUrl(`/chinh-sach/tai-lieu-chung/${event.rowData.form_id}`);
    this.formId = event.rowData.form_id;
    this.addNewPopup = true;
    if(this.indexTab === 0){
      this.titleHeader = 'Sửa tài liệu chung'
    }else {
      this.titleHeader = 'Sửa tài liệu cá nhân'
    }
  }


  initGrid() {
    if(this.indexTab === 0){
      this.columnDef();
    }else {
      this.columnDef2();
    }
  }

  // chung
  columnDef() {
    this.columnDefs = [
      {
        headerName: 'STT',
        filter: '',
        maxWidth: 70,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: '    ...',
        filter: '',
        maxWidth: 80,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]
  }
  //ca nhan
  columnDef2() {
    this.columnDefs = [
      {
        headerName: 'STT',
        filter: '',
        maxWidth: 120,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
        field: 'checkbox2',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        suppressSizeToFit: true,
        suppressRowClickSelection: true,
        checkboxSelection: (
          params: any
        ) => {
          return !!params.data && params.data.form_status !== 2;
        },
        showDisabledCheckboxes: true,
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: '    ...',
        filter: '',
        maxWidth: 80,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto', 'cell-options'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]
  }

  onFirstDataRendered(params: any) {
    params.api.forEachNode((node) =>
      node.setSelected(!!node.data && node.data.form_status === 2)
    );
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
      pageSize: 10,
      form_status: null,
      organizeIds: this.query.organizeIds
    }
    this.load();
  }

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    // const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight +  e.clientHeight + 200;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  handleFormType(): void {
    this.router.navigateByUrl('/hoat-dong/loai-tai-lieu');
  }
  addNewPopup = false;
  formTypeId2
  addNewPopup2 = false
  handleAdd(): void {
      this.formId = null;
      this.addNewPopup = true;
      this.titleHeader = 'Thêm mới tài liệu'
  }

  handleCallbackForm() {
    this.load();
    this.addNewPopup = false;
  }

  handleChange(event) {
    this.indexTab = event.index
    this.load();
  }

  listViews = []
  detailInfo = []
  getDetail() {
    const queryParams = queryString.stringify({formTypeId: this.formTypeId2});
    this.apiService.getFormsInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = cloneDeep(listViews);
          this.detailInfo = results.data;
        }
      });
  }

  setWorkApprove(event){
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event
    };
    this.apiService.setFormsTypeInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.addNewPopup2 = false;
          this.load();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      };
  }
  quaylai(r) {
    this.addNewPopup2 = false;
  }
  

  isShareButton = false;
  pushToApp() {
    let form_id = String(this.listDataSelect)
    if(this.listDataSelect.length > 0){
      const ids = queryString.stringify( { form_id: form_id})
      this.apiService.shareToApp(ids)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.spinner.hide();
            this.load();
          } else {
            this.messageService.add({
              severity: 'error', summary: 'Thông báo',
              detail: results.message
            });
            this.spinner.hide();
          }
        }), error => {
          console.error('Error:', error);
          this.spinner.hide();
        };
    }
    
  }

  onCellClicked(event){ 
    if(event.colDef.field === "link_view"){
      if(event.data.link_view){
        var url = event.data.link_view;
        var elem = document.createElement('a');
        elem.href = url;
        elem.target = 'hiddenIframe';
        elem.click();
      }
      
    }
  }

  rowSelected(data) {
    this.listDataSelect = []
    if(this.indexTab === 1){
      data.forEach(element => {
        if(element.form_status !== 2){
          this.listDataSelect.push(element.form_id)
        }
      });
    }
  }

  listViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];

  //filter 
  getFilter(value) {
    value === 1 ? '' : ''
    this.apiService.getFilter('/api/v1/eating/GetEatingFilter').subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViewsFilter = [...listViews];
        this.detailInfoFilter = results.data;
      }
    });
  }

  showFilter(value) {
    const ref = this.dialogService.open(FormFilterComponent, {
      header: 'Tìm kiếm nâng cao',
      width: '40%',
      contentStyle: "",
      data: {
        listViews: this.listViewsFilter,
        detailInfoFilter: this.detailInfoFilter,
        buttons: this.optionsButonFilter
      }
    });

    ref.onClose.subscribe((event: any) => {
      if (event) {
        this.listViewsFilter = cloneDeep(event.listViewsFilter);
        if (event.type === 'Search') {
          this.query = { ...this.query, ...event.data };
          this.load();
        } else if (event.type === 'CauHinh') {
        this.apiService.getEmpFilter().subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.listViewsFilter = [...listViews];
              this.detailInfoFilter = results.data;
              this.showFilter(1)
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.detailInfoFilter.group_fields);
          this.listViewsFilter = cloneDeep(listViews);
          this.cancel();
        }
      }
    });
  }

}
