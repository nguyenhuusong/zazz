
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chi-tiet-ke-hoach-tuyen-dung',
  templateUrl: './chi-tiet-ke-hoach-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-ke-hoach-tuyen-dung.component.scss']
})
export class ChiTietKeHoachTuyenDungComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() recruitPlanId = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class:  '', icon: 'pi pi-check'  },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ]
  displayuploadcontract = false;
  metafile = null;
  displaySetting= false;
  gridKeyForm= '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  modelEdit = {
    recruitPlanId: null,
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách kế hoạch tuyển dụng', routerLink: '/tuyen-dung/ke-hoach-tuyen-dung' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.recruitPlanId = this.recruitPlanId
      this.getRecruitPlan();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.recruitPlanId = this.paramsObject.params.recruitPlanId || null
      this.getRecruitPlan();
    });
  }
 
  cancel(data) {
    if (data === 'CauHinh') {
      this.getRecruitPlan() 
    }  else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dung']);
    }
  }

  setDetail(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.callApiInfo(params)
  }

  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setRecruitPlan(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dung'])
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getRecruitPlan() {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ recruitPlanId: this.modelEdit.recruitPlanId});
    this.apiService.getRecruitPlan(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        // this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dung'])
      }
    })
  }

}

  
  


