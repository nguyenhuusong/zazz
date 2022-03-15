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
import { NgxSpinnerService } from 'ngx-spinner';
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
    private spinner: NgxSpinnerService,
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
    this.getOrrginiaztions();
  }

  organizes = []
  getOrrginiaztions() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if(results.status === 'success') {
          this.organizes = results.data.map(d => {
            return {
              label: d.organizationName,
              value: `${d.organizeId}`,
              ...d
            }
          });
          this.modeAgencyOrganize.organizeId = this.organizes[0].value
          this.getUserByPush(this.organizes[0].value);

      }
    })
  }

  listUsers = [];
  getUserByPush(orgId) {
    this.spinner.show();
    this.apiService.getUserByPush({ organizeId: this.modeAgencyOrganize.organizeId, orgIds: [this.modeAgencyOrganize.organizeId] }).subscribe(results => {
      if (results.status === 'success') {
       this.listUsers = results.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: d.custId,
            roleName: 'user',
            ...d
          }
        });
        this.spinner.hide();
      }else {
        this.spinner.hide();
      }
    })
  }

  selectUser(value) {
    let items = this.listUsers.filter(d => d.value === this.modeAgencyOrganize.cusId);
    if(this.members.map(d => d.value).indexOf(this.modeAgencyOrganize.cusId) < 0) {
      this.members.push(items[0]);
      this.members = [...this.members]
    }
  }

  modeAgencyOrganize = {
    organizeId: '',
    cusId: ''
  }


  handleAdd(): void {
    this.save.emit([...this.members]);
  }

  initGrid(): void {
    this.columnDefs = [
      {
        headerName: 'Avatar',
        field: 'avatar',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        cellRenderer: 'avatarRendererFull',
        width: 100
      },
      {
        headerName: 'Họ tên',
        field: 'fullName',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        width: 250,
      },
      {
        headerName: 'Số điện thoại',
        field: 'phone',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        width: 250,
      },
      {
        headerName: 'Email',
        field: 'email',
        headerClass: ['cl6dabe8', 'd-flex', 'flex-row', 'justify-content-center'],
        width: 250,
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
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn xóa không?',
    //   accept: () => {
    //     this.apiService.delMeetingInfo(e.rowData.meet_ud)
    //       .subscribe(response => {
    //         if (response.status === 'success') {
    //           this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Xóa thành công` });
    //         } else {
    //           this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
    //         }
    //       }, error => {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Xóa thất bại` });
    //       });
    //   }
    // });

    this.members.splice(e.rowIndex, 1);
    this.members = [...this.members]
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
