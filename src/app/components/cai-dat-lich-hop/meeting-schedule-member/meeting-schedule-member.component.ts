import { Router } from '@angular/router';
import { ApiService } from './../../../services/api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as queryString from 'querystring';
import { AgGridFn } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-meeting-schedule-member',
  templateUrl: './meeting-schedule-member.component.html',
  styleUrls: ['./meeting-schedule-member.component.css']
})
export class MeetingScheduleMemberComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  loading = false;
  columnDefs;
  detailRowHeight;
  defaultColDef;
  detailEmployee;
  frameworkComponents;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  members = [];
  totalRecord = 0;
  gridColumnApi;
  results: string[];
  selectedMember = '';
  constructor(
    private apiService: ApiHrmService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 38;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent
    };
  }

  ngOnInit(): void {
    this.initGrid();
  }
  search(event): void {
    this.columnDefs = []
    const queryParams = queryString.stringify({orgId: 1, offSet: 0, pageSize: 10000, filter: event.query});
    this.apiService.getEmployeePage(queryParams)
    .subscribe(response => {
        this.results = response.data.dataList.data.map(t => ({...t, displayName: t.code + ' - ' + t.full_name + ' - ' + t.phone1}));
        this.initGrid();
    });
  }

  handleSelectedMember(): void {
    this.members = [this.selectedMember, ...this.members];
    this.selectedMember = '';
  }

  handleAdd(): void {
    this.save.emit([...this.members]);
  }

  initGrid(): void {
    this.columnDefs = [
      {
        headerName: 'Avatar',
        field: 'avatar_url',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        cellRenderer: 'avatarRendererFull',
        width: 100
      },
      {
        headerName: 'Họ tên',
        field: 'full_name',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        width: 250,
      },
      {
        headerName: 'Vai trò ',
        field: 'isApproved',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        width: 130,
        cellRenderer: params => {
          return 'Thành viên';
        }
      },
      {
        headerName: 'ID',
        field: 'userId',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
      },
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: 'right',
        width: 60,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: this.objectAction ? this.objectAction.cellClass : ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.handleDelete.bind(this),
                label: 'Xóa',
                icon: 'fa fa-trash',
                class: 'btn-danger mr5',
                hide: (params.data.status === 3)
              },
            ]
          };
        },
      },
    ];
  }

  handleDelete(e): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa không?',
      accept: () => {
        this.apiService.delMeetingInfo(e.rowData.meet_ud)
          .subscribe(response => {
            if (response.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Xóa thành công` });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
            }
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
          });
      }
    });
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  handlerError(error): void {
    console.log(error);
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
  }
}
