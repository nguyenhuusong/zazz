import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, SimpleChanges, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-store-notify',
  templateUrl: './store-notify.component.html',
  styleUrls: ['./store-notify.component.css']
})
export class StoreNotifyComponent implements OnInit, OnChanges {
  @Input() notify;
  @Input() external_sub;
  @Input() indexTab;
  @Input() isNotifi: boolean = true;
  @Input() moduleLists;
  @Output() reload = new EventEmitter<any>();
  loading = false;
  buildings: any = [];
  apartments: any = [];
  listUserPushNotifis = [];
  clientWidth = 0;
  searchInput = '';
  buildingCd = '';
  actions = [
    { name: 'Push', value: '1' },
    { name: 'SMS', value: '2' },
    { name: 'Email', value: '3' }
  ];
  projectCd = '';
  action = '1';
  model: any = {};
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  gridflexdetails: any;
  objectAction: any;
  objectActionDetails: any;
  getRowHeight;
  modelGetUserByprojectCd = {
    project_cd: '',
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 1000000
  }
  listProduct = [];
  listProductSelect = [];
  listUsers = null;
  listUserSelects = [];
  departmentFiltes = [];
  perent_id = null;
  sub_prod_cd: any = null;
  moduleList = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS;

  gridflexs = [
    {
      cellClass: ["border-right", "align-items-center", 'no-auto'],
      columnCaption: "Ảnh đại diện",
      columnField: "avatar",
      columnWidth: 100,
      fieldType: "image",
      isFilter: false,
      isHide: false,
      isMasterDetail: false,
      isStatusLable: false,
      pinned: null,
    },
    {
      cellClass: ["border-right", "align-items-center"],
      columnCaption: "Người dùng",
      columnField: "fullName",
      columnWidth: 100,
      fieldType: "text",
      isFilter: false,
      isHide: false,
      isMasterDetail: false,
      isStatusLable: false,
      pinned: null,
    },
    {
      cellClass: ["border-right", "align-items-center"],
      columnCaption: "Số điện thoại",
      columnField: "phone",
      columnWidth: 100,
      fieldType: "text",
      isFilter: false,
      isHide: false,
      isMasterDetail: false,
      isStatusLable: false,
      pinned: null,
    },
    {
      cellClass: ["border-right", "align-items-center"],
      columnCaption: "Email",
      columnField: "email",
      columnWidth: 100,
      fieldType: "text",
      isFilter: false,
      isHide: false,
      isMasterDetail: false,
      isStatusLable: false,
      pinned: null,
    },
    // {
    //   cellClass: ["border-right", "align-items-center", "bd-edit", "no-auto"],
    //   columnCaption: "LD",
    //   columnField: "active",
    //   columnWidth: 100,
    //   fieldType: "check",
    //   isFilter: false,
    //   isHide: false,
    //   isMasterDetail: false,
    //   isStatusLable: false,
    //   pinned: null,
    // },
  ];


  constructor(
    private apiService: ApiHrmService,
    private cderf: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    
    private router: Router) {
    this.defaultColDef = {
      resizable: true,
    };
    this.frameworkComponents = {
      buttonAgGridComponent: ButtonAgGridComponent,
    };
    this.getRowHeight = function (params) {
      return 50;
    };
  }

  ngOnInit(): void {
    this.getOrganizeTree();
    this.getUserByPush();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getProductOrderPage() {
    const queryParams = queryString.stringify(this.modelGetUserByprojectCd);
    
  }

  selectUsers(event) {
    let items = this.listUsers.dataList.data.filter(user => user.userId === event.value);
    if (items.length > 0 && this.listUserPushNotifis.map(d => d.userId).indexOf(items[0].userId) < 0) {
      this.listUserPushNotifis.push(items[0]);
      this.listUserPushNotifis = [...this.listUserPushNotifis];
    }
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.perent_id });
    this.apiService.getOrganizeTree(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data || [];
        }
        this.sub_prod_cd = null
      },
        error => { });
  }

  closeModal() {
    this.reload.emit()
  }

  listsData = [];
  danhsachphongban = [];

  onNodeSelect(event) {
    if (this.danhsachphongban.indexOf(event.node.orgId) < 0) {
      this.danhsachphongban.push(event.node.orgId);
    }
  }

  onNodeUnselect(event) {
    if (this.danhsachphongban.indexOf(event.node.orgId) > -1) {
      this.danhsachphongban = this.danhsachphongban.filter(s => s !== event.node.orgId);
    }
  }

  getAllUserPush() {
    const saveData = {
      // notiId: this.notify.notiId,
      n_id: this.notify.n_id,
      appUsers: this.listsData
    };
    this.storePushList(saveData)
  }
  query = {
    filter: ''
  }

  getUserByPush() {
    this.columnDefs = []
    const params = {
      "orgIds": this.danhsachphongban,
      "employees": [],
      "filter": this.query.filter
    }
    this.spinner.show();
    this.apiService.getUserByPush(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listsData = results.data.map(d => {
          return { ...d, active: false }
        });
        this.initTableGrid();
        this.spinner.hide();
        
      }else {
        this.spinner.hide();
      }
      if(results.status === 'error'){
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message});
      }
    })
  }

  saveUserByPush() {
    if(this.appUsers.length > 0) {
      if(this.isNotifi) {
        const saveData = {
          // notiId: this.notify.notiId,
          n_id: this.notify.n_id,
          appUsers: this.appUsers
        };
        this.storePushList(saveData)
        console.log('saveData', saveData)
      }else {
        const saveData = {
          // notiId: this.notify.notiId,
          n_id: null,
          appUsers: this.appUsers
        };
        this.reload.emit(saveData)
        console.log('saveData2', saveData)
      }
      console.log('this.isNotifi', this.isNotifi)
    
    }else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn bản ghi nào !' });
    }
   
  }

  storePushList(params) {
    this.spinner.show();
    this.apiService.setNotifyCreatePush(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: any) => {
      if (result.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: result.data ? result.data : 'Thành công' });
        this.spinner.hide();
        this.closeModal();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: result.data ? result.data : 'Thành công' });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    });
  }

  removeItem(event) {
    this.confirmationService.confirm({
      message: 'Bạn chắc chắn muốn thực hiện hành động này',
      accept: () => {
        const index = this.listUserPushNotifis.findIndex(t => t.userId === event.rowData.userId);
        if (index !== -1) {
          this.listUserPushNotifis.splice(index, 1);
          this.listUserPushNotifis = [...this.listUserPushNotifis]
        }
      }
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  appUsers = [];
  selectRow(event) {
    this.appUsers = event;
  }

  text
  initTableGrid() {
    this.columnDefs = [ {
      headerName: 'STT',
      filter: '',
      maxWidth: 80,
      pinned: 'left',
      cellClass: ['border-right', 'no-auto'],
      checkboxSelection: true,
      headerCheckboxSelection: true,
      field: 'checkbox',
      cellRenderer: params => params.rowIndex + 1
    },
      ...AgGridFn(this.gridflexs)
    ];
  }

  showButtons(params) {
    return {
      buttons: [
        {
          onClick: this.removeItem.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-danger',
          show: true
        },
      ]
    };
  }

  agGridFn(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
      let row: any = null;
      if (value.isStatusLable) {
        row = {
          headerName: value.columnCaption,
          field: value.columnField,
          cellClass: value.cellClass,
          filter: value.isFilter ? 'agTextColumnFilter' : '',
          sortable: true,
          width: value.columnWidth,
          cellRenderer: (params: any) => {
            return `<span class="noti-number noti-number-on ml5">${params.value}</span>`
          },
          hide: value.isHide ? true : false,
          pinned: value.pinned,
          headerTooltip: value.columnCaption,
          tooltipField: value.columnField
        }
      } else {
        if (value.columnField === 'avatarUrl' || value.fieldType === 'image') {
          row = {
            headerName: value.columnCaption,
            field: value.columnField,
            // cellClass: value.cellClass,

            filter: value.isFilter ? 'agTextColumnFilter' : '',
            sortable: true,
            width: value.columnWidth,
            hide: value.isHide ? true : false,
            pinned: value.pinned,
            cellRenderer: "avatarRendererFull",
            headerTooltip: value.columnCaption,
            tooltipField: value.columnField,
            cellClass: value.cellClass,
            // valueFormatter: value.fieldType == 'decimal' ? ""
          }
        } else if (value.fieldType === 'check') {
          row = {
            headerName: value.columnCaption,
            field: value.columnField,
            cellClass: value.cellClass,
            filter: value.isFilter ? 'agTextColumnFilter' : '',
            sortable: true,
            width: value.columnWidth,
            cellRenderer: (params) => {
              var input = document.createElement('input');
              input.type = "checkbox";
              input.checked = params.value;
              input.addEventListener('click', (event) => {
                params.value = !params.value;
                params.node.data.active = params.value;
              });
              return input;
            },
            hide: value.isHide ? true : false,
            pinned: value.pinned,
            headerTooltip: value.columnCaption,
            // tooltipField: value.columnField
            // valueFormatter: value.fieldType == 'decimal' ? "x.toLocaleString()" : ""
          }
        } else {
          row = {
            headerName: value.columnCaption,
            field: value.columnField,
            cellClass: value.cellClass,
            filter: value.isFilter ? 'agTextColumnFilter' : '',
            sortable: true,
            width: value.columnWidth,
            cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
            hide: value.isHide ? true : false,
            pinned: value.pinned,
            tooltipField: value.columnField,
            headerTooltip: value.columnCaption
            // valueFormatter: value.fieldType == 'decimal' ? ""
          }
        }
      }

      arrAgGrids.push(row);
    }
    return arrAgGrids
  }

}
