
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';

@Component({
  selector: 'app-chi-tiet-lich-hop',
  templateUrl: './chi-tiet-lich-hop.component.html',
  styleUrls: ['./chi-tiet-lich-hop.component.scss']
})
export class ChiTietLichHopComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  listViews = [];
  meet_ud = '';
  detailInfo = null;
  listsData = [];
  columnDefs;
  showChooseMember = false;
  @Input() dataRouter = null;
  @Output() back = new EventEmitter<any>();
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  titlePage = '';
  items = [];
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách lịch hop', routerLink: '/cai-dat/cai-dat-lich-hop' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }

  paramsObject;
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.meet_ud = this.paramsObject.params.meet_ud;
        this.getMeetingInfo();
      });
  };

  getMeetingInfo(): void {
    this.listViews = [];
    this.listsData = [];
    this.apiService.getMeetingInfo(`?meet_ud=${this.meet_ud || ''}`).subscribe(results => {
      if (results.status === 'success') {
        results.data.group_fields.forEach(group => {
          // group.fields.forEach(d=> {
          //   if(d.field_name === 'meet_name' ||  d.field_name === 'meet_time') {
          //     d.columnDisplay = 1
          //     d.columnClass = 'col-12'
          //   }else {
          //     d.columnDisplay = 2,
          //     d.columnClass = 'col-12'
          //   }
          // })
        })
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.members);
        this.columnDefs = [...AgGridFn(this.detailInfo.gridflexdetails1 || []), {
          headerName: '',
          field: 'button',
          filter: '',
          pinned: 'right',
          width: 50,
          cellRenderer: 'buttonAgGridComponent',
          cellClass: ['border-right text-center'],
          cellRendererParams: () => this.showButton()
        }];
      }
    });
  }

  showButton(): any {
    return {
      buttons: [
        {
          onClick: this.handleRemoveMember.bind(this),
          label: 'Xóa',
          key: 'DELETE',
          icon: 'pi pi-trash',
          class: 'btn-danger',
        },

      ]
    };
  }

  handleRemoveMember(event): void {
    this.listsData = this.listsData.filter(t => t.userId !== event.rowData.userId);
  }

  handleChooseMember(datas): void {
    datas.forEach(user => {
      if(this.listsData.map(d => d.userId).indexOf(user.userId) < 0) {
        this.listsData.push({
          avatarUrl: user.avatar,
          fullName: user.fullName,
          roleName: user.roleName,
          userId: user.userId
        })
      }
    })
    this.listsData = [...this.listsData];
    this.showChooseMember = false;
  }

  setMeetRoomInfo(data): void {
    const params = {
      ...this.detailInfo, group_fields: data, members: this.listsData
    };
    this.apiService.setMeetingInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
      this.onBack()
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Thông báo', detail: 'Thao tác thất bại'});
    });
  }

  onChangeButtonView(event): void {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.router.navigateByUrl('/meeting-schedule');
    }
  }

  onBack() {
    this.router.navigateByUrl('/cai-dat/cai-dat-lich-hop');
  }

  cancelUpdate(event): void {
    if(event === 'CauHinh') {
      this.getMeetingInfo();
    }else {
      this.manhinh = 'Edit';
      this.onBack();
    }
 
  }

  handleAddMember(): void {
    this.showChooseMember = true;
  }
}

