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
  selector: 'app-chi-tiet-phong-hop-theo-tang',
  templateUrl: './chi-tiet-phong-hop-theo-tang.component.html',
  styleUrls: ['./chi-tiet-phong-hop-theo-tang.component.scss']
})
export class ChiTietPhongHopTheoTangComponent implements OnInit, OnDestroy {
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
  floorId = '';
  detailInfo = null;
  listsData = [];
  columnDefs;
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
        this.floorId = this.paramsObject.params.floorId;
        this.getMeetingFloorInfo();
      });
  };

  getMeetingFloorInfo(): void {
    this.listViews = [];
    this.listsData = [];
    this.apiService.getMeetingFloorInfo(`?floorId=${this.floorId || ''}`).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.members);
      }
    });
  }


  setMeetingFloorInfo(data): void {
    const params = {
      ...this.detailInfo, group_fields: data, members: this.listsData
    };
    this.apiService.setMeetingFloorInfo(params).subscribe((results: any) => {
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
    this.router.navigateByUrl('/cai-dat/quan-ly-phong-hop-theo-tang');
  }

  cancelUpdate(): void {
    this.manhinh = 'Edit';
    this.onBack();
  }
}

