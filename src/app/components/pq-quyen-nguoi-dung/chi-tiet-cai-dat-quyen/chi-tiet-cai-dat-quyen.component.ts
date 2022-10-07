import { Component, OnDestroy, OnInit } from '@angular/core';
import { AllModules, FirstDataRenderedEvent, Module } from '@ag-grid-enterprise/all-modules';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import * as queryString from 'querystring';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-chi-tiet-cai-dat-quyen',
  templateUrl: './chi-tiet-cai-dat-quyen.component.html',
  styleUrls: ['./chi-tiet-cai-dat-quyen.component.scss']
})
export class ChiTietCaiDatQuyenComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  public agGridFn = AgGridFn;
  public modules: Module[] = AllModules;
  dataRouter = null;
  optionsButon = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-plus' }
  ]
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
    };
    this.getRowHeight1 = (params) => {
      if (params.node.master) {
        return 40;
      } else {
        return 300;
      }
    };
  }

  indexTab = 0;

  query = {
    webId: '',
    filter: '',
    gridWith: 0,
    offSet: 0,
    pageSize: 10000000
  }
  getRowHeight1
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  gridflexs: any;
  displayaddFunctions: boolean = false;
  getRowHeight;
  detailWebSmart: any = {};
  isEdit = false;
  titlePage = null;
  paramsObject = null;
  itemsBreadcrumb = [];
  ngOnInit(): void {
    this.titlePage = this.route.data['_value'].title;
    this.itemsBreadcrumb = [
      { label: 'Trang chủ' },
      { label: 'Quyền người dùng', routerLink: '/phan-quyen/quyen-nguoi-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
    this.GetMenuConfigInfo();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  handleParams() {
    this.route.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.query.webId = this.paramsObject.params.id || null;
        // this.callApiGetInfo(0);
      });
  };

  
  // data grid for tab
  menusTab: any = {}
  rolesTab: any = {}
  clientactionGrid = []
  GetMenuConfigInfo() {
    const query = {  }
    this.apiService.getMenuConfigInfo(queryString.stringify(query)).subscribe((results: any) => {
      if(results.status === 'success'){
        this.menusTab.data = results.data.menus
        this.menusTab.menutree = results.data.menutree
        this.menusTab.gridflexs = results.data.view_grids_menu
        
        this.rolesTab.data = results.data.roles;
        this.rolesTab.gridflexs = results.data.view_grids_roles;
        
        this.rolesTab.data = results.data.clientaction;
        this.rolesTab.gridflexs = results.data.view_grids_action;
      }
    })
  }
  

  dataFieldsInfo = null;
  listViewWebInfo = []
  // callApiGetInfo(index = 0) {
  //   this.spinner.show();
  //   const queryParams = queryString.stringify({ webId: this.query.webId });
  //   const getClientWebInfoManager = this.apiService.getClientWebInfoManager(queryParams);
  //   forkJoin([getClientWebInfoManager])
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((results: any) => {
  //       if (results && results[0].status === 'success') {
  //         this.listViewWebInfo = cloneDeep(results[0].data.group_fields);
  //         this.dataFieldsInfo = results[0].data;
  //         this.spinner.hide();
  //       }
  //     })
  // }

  handleChange(index) {
    this.indexTab = index;
  }

  listViews = [];
  detailInfo = null;

  // saveWebInfo(data) {
  //   const params = {
  //     ...this.dataFieldsInfo,
  //     group_fields: data,
  //   };
  //   this.apiService.setClientWebInfoManager(params).subscribe((results: any) => {
  //     if (results.status === 'success') {
  //       this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
  //       this.callApiGetInfo()
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
  //     }
  //   }), error => {
  //   };
  // }

  // cancelUpdate(data) {
  //   if (data === 'CauHinh') {
  //     this.callApiGetInfo();
  //   }
  // }

}