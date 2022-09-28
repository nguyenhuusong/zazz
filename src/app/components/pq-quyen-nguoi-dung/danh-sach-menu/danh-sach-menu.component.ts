import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridFn } from 'src/app/common/function-common/common';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-danh-sach-menu',
  templateUrl: './danh-sach-menu.component.html',
  styleUrls: ['./danh-sach-menu.component.scss']
})
export class DanhSachMenuComponent implements OnInit {
  @Input() detailInfo: any = null;
  @Output() callback = new EventEmitter<any>();
  optionsButon = [
    // { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-plus' }
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  columnDefs = [];
  listsData = []
  heightGrid = 500;
  gridKey = ''
  displaySetting = false;
  cauhinh() {
    this.displaySetting = true;
  }

  ngOnInit(): void {
    this.initGrid(this.columnDefs);
    this.getMenuConfigInfo()
    // this.getClientActionListByWebId()
  }


  getMenuConfigInfo(id = null) {
    this.columnDefs = []
    let query = {}
    if(id){
      query = { gridWidth: id }
    }else{
      query = {}
    }
    this.apiService.getMenuConfigInfo(queryString.stringify(query)).subscribe((results: any) => {
      if (results.status === 'success') {
        this.listsData = cloneDeep(results?.data?.menus);
        this.sourceActions = results.data.actions;
        this.targetActions = results.data.clientaction
        if(results.data && results.data.view_grids_menu){
          this.initGrid(results.data.view_grids_menu);
        }
        this.gridKey = results?.data?.dataList?.gridKey
      }
    })
  }
  listActions = [];
  sourceActions = [];
  targetActions = [];
  // getClientActionListByWebId() {
  //   this.columnDefs = []
  //   const queryParams = queryString.stringify({ webId: this.detailInfo.webId });
  //   this.apiService.getClientActionListByWebId(queryParams).subscribe(results => {
  //     if (results.status === 'success') {
  //       this.listActions = cloneDeep(results.data.dataList.data);
  //       this.targetActions = cloneDeep(this.listActions);
  //     }
  //   })
  // }

  onTargetFilter(event) {
    if (event.query === "") {
      this.targetActions = cloneDeep(this.listActions)
    } else {
      this.targetActions = cloneDeep(event.value)
    }
  }

  create() {
    this.getConfigMenu(null)
  }

  initGrid(gridflexs) {
    console.log('columnDefs', gridflexs)
    this.columnDefs = [
      ...AgGridFn(gridflexs),
      {
        headerName: 'Thứ tự',
        pinned: 'right',
        field: 'intPosEdit',
        onCellValueChanged: params => {
          this.onCellValueChanged(params)
        },
        cellRenderer: params => {
          return params.data.intPos
        },
        width: 90,
        editable: true,
        cellClass: ['border-right', 'bg-f7ff7']
      },
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: 'right',
        width: 90,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.suaThongTin.bind(this),
                label: 'Xem thông tin',
                key: 'chinhsualaixuat',
                icon: 'fa fa-edit',
                class: 'btn-primary mr5',
              },

              {
                onClick: this.delete.bind(this),
                label: 'Xóa',
                key: 'xoalaixuat',
                icon: 'pi pi-trash',
                class: 'btn-primary mr5',
              },

            ]
          };
        },
      },
    ];
  }
  expanded = null
  onCellValueChanged(event) {
    if (event.colDef.field === 'intPosEdit' || event.colDef.field === 'intPosEditParent') {
      this.spinner.show();
      const queryParams = queryString.stringify({ menuId: event.data.menuId, webId: this.detailInfo.webId });
      this.apiService.getConfigMenu(queryParams).subscribe(results => {
        if (results.status === 'success') {
          const listViews = results.data.group_fields.forEach(element => {
            element.fields.forEach(element1 => {
              if (element1.field_name === 'intPos') {
                element1.columnValue = event.newValue
              } else if (element1.field_name === 'parentId' && event.colDef.field === 'intPosEdit') {
                this.expanded = element1.columnValue ? element1.columnValue : null;
              }
            });
          });
          this.spinner.hide();
          this.listViews = [...listViews];
          this.detailDetailInfo = results.data;
          this.setConfigMenu(this.listViews);
        } else {
          this.spinner.hide();
        }
      })
    }
  }


  suaThongTin(event) {
    this.getConfigMenu(event.rowData.menuId);
  }

  listViews = [];
  detailDetailInfo = null;
  displayInfo = false;
  getConfigMenu(menuId) {
    const query: any = { }
    if(menuId){
      query.menuId = menuId;
    }
    this.listViews = [];
    const queryParams = queryString.stringify(query);
    this.apiService.getConfigMenu(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailDetailInfo = results.data;
        this.sourceActions = results.data.actions;
        this.displayInfo = true;
      }
    })
  }

  delete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ menuId: event.rowData.menuId });
        this.apiService.delConfigMenu(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.callback.emit();
            this.displayInfo = false
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
          }
        });
      }
    })
  }

  setConfigMenu(data) {
    this.spinner.show();
    const params = {
      ...this.detailDetailInfo, group_fields: data, actions: this.sourceActions
    };
    this.apiService.setConfigMenu(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
        this.spinner.hide();
        this.getMenuConfigInfo();
        this.displayInfo = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }), error => {
      this.spinner.hide();
    };
  }

  cancelUpdate(data) {
    if (data === 'CauHinh') {
      this.getConfigMenu(this.detailDetailInfo.menuId);
    }
  }

}
