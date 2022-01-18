import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import * as queryString from 'querystring';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
import { AgGridFn } from '../function-common/common';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
@Component({
  selector: 'app-search-user-master',
  templateUrl: './search-user-master.component.html',
  styleUrls: ['./search-user-master.component.css']
})
export class SearchUserMasterComponent implements OnInit {
  public modules: Module[] = AllModules;
  @Output() callbackformSearch = new EventEmitter<any>();
  @Input() indexTab = 0
  @Input() disabled = 3
  @Input() button: any[] = []
  constructor(
    private apiService: ApiCoreService,

  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 70;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
   }
  agGridFn = AgGridFn;
  columnDefs;
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  getRowHeight;
  listTypeCustomer = [
    { label: 'Mã Khách hàng', value: 0 },
    { label: 'Số CMT/ HC', value: 1 },
    { label: 'Số điện thoại', value: 2 },
    { label: 'Tên khách hàng', value: 3 },
  ];
  listTypeCustomerCorp = [
    { label: 'Mã khách hàng', value: 0 },
    { label: 'Mã số thuế', value: 1 },
    { label: 'Tên doanh nghiệp', value: 2 },
  ];

  modelSearchOrder = {
    keyType: 2,
    cif_no: null,
    isCorp: false,
    filter: ''
  }

  ngOnInit(): void {
    if(this.indexTab == 1) {
      this.modelSearchOrder.isCorp = true;
      this.modelSearchOrder.keyType = 2
      this.detailType =  { label: 'Tên doanh nghiệp', value: 2 };
    }else {
      this.modelSearchOrder.keyType = 2
      this.modelSearchOrder.isCorp = false;
      this.detailType = { label: 'Số điện thoại', value: 2 };
    }
  }
  listTypeSearchS = []
  results = []
  detailType: any = { label: 'Số điện thoại', value: 2 };

  handleChange(event) {
    this.indexTab = event.index;
    if (this.indexTab === 0) {
      this.reload();
      this.modelSearchOrder.keyType = 2
      this.modelSearchOrder.isCorp = false;
      this.detailType = { label: 'Số điện thoại', value: 2 };
    } else if (this.indexTab === 1) {
      this.reload();
      this.modelSearchOrder.isCorp = true;
      this.modelSearchOrder.keyType = 2
      this.detailType =  { label: 'Tên doanh nghiệp', value: 2 };
    }
  }

  reload() {
    this.modelSearchOrder.filter = '';
    this.columnDefs = [];
    this.results = [];
  }

  changeKeyType(event) {
    if(this.indexTab === 0) {
      const items = this.listTypeCustomer.filter(d => d.value === event.value);
      this.detailType = items.length > 0 ? items[0] : null;
      this.modelSearchOrder.filter = '';
    }else {
      const items = this.listTypeCustomerCorp.filter(d => d.value === event.value);
      this.detailType = items.length > 0 ? items[0] : null;
      this.modelSearchOrder.filter = '';
    }

  }

  onClearDetailCifNo() {

  }

  selectCustomer() {

  }

  initGridUser(gridflexs) {
    this.columnDefs = [
      ...this.agGridFn(gridflexs),
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: 'right',
        width: 60,
        cellRenderer: 'buttonRendererMutiComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.ChooseUserView.bind(this),
                label: 'Xem chi tiết',
                icon: 'pi pi-check',
                class: 'btn-primary',
                hide: this.button.indexOf('View') < 0
              },
              {
                onClick: this.ChooseUserEdit.bind(this),
                label: 'Sửa thông tin',
                icon: 'pi pi-check',
                class: 'btn-primary',
                hide: this.button.indexOf('Edit') < 0
              },
              {
                onClick: this.ChooseUserSelect.bind(this),
                label: 'Chọn',
                icon: 'pi pi-check',
                class: 'btn-primary',
                hide: this.button.indexOf('Select') < 0
              },
            
            ]
          };
        },
      },
    ];
  }

  ChooseUserView(event) {
    this.callbackformSearch.emit({...event.rowData, type: 'View'});
  }

  ChooseUserEdit(event) {
    this.callbackformSearch.emit({...event.rowData, type: 'Edit'});
  }

  ChooseUserSelect(event) {
    this.callbackformSearch.emit({...event.rowData, type: 'Select'});
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  searchUser() {
    const keyName = this.modelSearchOrder.filter;
    const keyType = this.modelSearchOrder.keyType;
    const queryParams = queryString.stringify({ offSet: 0, pageSize: 1500000000, filter: '', keyType: keyType, custPrivate: false, gridWidth: 1550, keyName: keyName });
    if (this.modelSearchOrder.isCorp) {
      this.apiService.getCustCoporatePage(queryParams)
        .pipe(
        ).subscribe(results => {
          if (results.status === 'success') {
            this.results = cloneDeep(results.data.dataList.data);
            this.initGridUser(results.data.gridflexs)
          }
        });
    } else {
      this.apiService.searchCustomer(queryParams)
        .pipe(
        )
        .subscribe(repo => {
          this.results = cloneDeep(repo.data.dataList.data);
           this.initGridUser(repo.data.gridflexs)
        });
    }
  }

}
