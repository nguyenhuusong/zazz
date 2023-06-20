import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-cham-cong',
  templateUrl: './chi-tiet-cham-cong.component.html',
  styleUrls: ['./chi-tiet-cham-cong.component.scss']
})
export class ChiTietChamCongComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButtonsView = [];
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
  recordId = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';
  detailInfo = null;
  listsData = []
  columnDefs
  cols: any[];
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  queryDetail = {
    recordId: '',
    empId: '',
    work_date: ''
  }
  isDetail = false;

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  items = [];
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách chấm công', routerLink: '/chinh-sach/cham-cong' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      // this.recordId = this.paramsObject.params.recordId;
      this.getChamCongInfo();
    });
  };

  getChamCongInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify(this.paramsObject.params);
    this.apiService.getTimekeepingInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = results.data.checkinouts;
        this.columnDefs = [

          ...AgGridFn(results.data.gridflexcheckinout.filter((d: any) => !d.isHide)),
          {
            filter: '',
            width: 70,
            pinned: 'right',
            cellRenderer: 'buttonAgGridComponent',
            cellClass: ['border-right', 'no-auto'],
            cellRendererParams: (params: any) => this.showButtons(params),
            checkboxSelection: false,
            field: 'checkbox'
          }
        ]
      }
    })
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Xem',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
      ]
    };
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setCompanyInfo(data) {
    // const params = {
    //   ...this.detailInfo, group_fields: data
    // };
    // this.apiService.setCompanyInfo(params).subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.displayUserInfo = false;
    //     if(this.url === 'them-moi-nghi-phep') {
    //       this.goBack()
    //     }else {
    //       this.manhinh = 'Edit';
    //       this.getCompanyInfo();
    //     }
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
    //   } else {
    //     this.messageService.add({
    //       severity: 'error', summary: 'Thông báo', detail: results.message
    //     });
    //   }
    // }, error => {
    // });
  }

  initGrid() {
    
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/chinh-sach/cham-cong']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getChamCongInfo();
    }else {
      this.router.navigate(['/chinh-sach/cham-cong']);
    }
  }

  editRow({ rowData }) {
    this.isDetail = true;
    this.queryDetail.empId = rowData.empId;
    this.queryDetail.recordId = rowData.recordId;
    this.queryDetail.work_date = rowData.work_date;
  }

  quaylai() {
    this.router.navigate(['/chinh-sach/cham-cong']);
  }

  callback() {
    this.isDetail = false;
  }

}



