
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridFn } from 'src/app/common/function-common/common';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-danh-sach-action',
  templateUrl: './danh-sach-action.component.html',
  styleUrls: ['./danh-sach-action.component.scss']
})
export class DanhSachActionComponent implements OnInit {
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
  gridKey = 'view_sysconfig_actions'
 displaySetting = false;
   cauhinh() {
     this.displaySetting = true;
   }
  ngOnInit(): void {
    this.getClientActions();
    this.getActions();
  }
 
 
  getClientActionListByWebId() {
    // this.columnDefs = []
    // const queryParams = queryString.stringify({ webId: this.detailInfo.webId });
    // this.apiService.getClientActionListByWebId(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listsData = cloneDeep(results.data.dataList.data);
    //     this.initGrid(results.data.gridflexs);
    //     this.gridKey = results.data.dataList.gridKey
    //   }
    // })
  }
  getClientActions() {
  this.columnDefs = []
    const query = {  }
    this.apiService.getMenuConfigInfo(queryString.stringify(query)).subscribe((results: any) => {
      if (results.status === 'success') {
        this.listsData = cloneDeep(results?.data?.clientaction);
        if(results.data && results.data.view_grids_action){
          this.initGrid(results.data.view_grids_action);
        }
      }
    })
  }

  getActions() {
    // this.apiService.getConfigActionList().subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.listsData = cloneDeep(results?.data);
    //   }
    // })
  }

  create() {
    this.modelAction = {
      actionId: 0,
      actionCd: "",
      actionName: ""
    }
    this.displayInfo = true;
  }

  saveAction() {
    this.apiService.setConfigMenuAction(this.modelAction).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới action thành công' });
        this.displayInfo = false;
        this.getClientActions();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Thêm action không thành công' });
        this.displayInfo = false;
      }
    })
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs),
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

  suaThongTin(event) {
     this.displayInfo = true;
      this.modelAction = {
        actionId: event.rowData.actionId,
        actionCd: event.rowData.actionCd,
        actionName: event.rowData.actionName,
      }
  }
  displayInfo = false;
  modelAction = {
    actionId: null,
    actionCd: '',
    actionName: '',
  }

  listViews = [];
 

  delete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ actionId: event.rowData.actionId });
        this.apiService.delConfigMenuAction(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.getActions();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
          }
        });
      }
    })
  }

  setClientMenuInfo(data) {
    this.spinner.show();

    // this.apiService.setClientMenuInfo(params).subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
    //     this.spinner.hide();
    //     this.getClientActionListByWebId();
    //     this.displayInfo = false;
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
    //     this.spinner.hide();
    //   }
    // }), error => {
    //   this.spinner.hide();
    // };
  }

}
