import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chi-tiet-chinh-sach-luong',
  templateUrl: './chi-tiet-chinh-sach-luong.component.html',
  styleUrls: ['./chi-tiet-chinh-sach-luong.component.scss']
})
export class ChiTietChinhSachLuongComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() id = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButtonsView = []
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
    schemeId: null,
  }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách chính sách lương', routerLink: '/luong-thue/chinh-sach' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.schemeId = this.id
      this.getSchemeInfo();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.schemeId = this.paramsObject.params.schemeId || null
      this.getSchemeInfo();
    });
  }
  indexTab = 0;
  handleChange(index) {
    this.indexTab = index;
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.getSchemeInfo() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getSchemeInfo(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/luong-thue/chinh-sach']);
    }
  }

  onBackPage() {
    this.isDialog ? this.callback.emit() : this.router.navigate(['/luong-thue/chinh-sach'])
  }

  setSchemeInfo(data) {
      const params = {
        ...this.detailInfo, group_fields: data.datas
      }
      this.callApiInfo(params)
  }
  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setSchemeInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.schemeId = results.data.schemeId;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        setTimeout(() => {
          this.isDialog ? this.callback.emit() : this.router.navigate(['/luong-thue/chinh-sach'])
        }, 200);
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
  status = [];
  selectedStatus = null;
  getSchemeInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ schemeId: this.modelEdit.schemeId, flow_cur: flow_cur });
    this.apiService.getSchemeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.schemeId = results.data.schemeId;
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if( this.detailInfo.actions) {
           this.initButton();
        }
       
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/luong-thue/chinh-sach'])
      }
    })
  }

  UpdateStatus() {
    this.getSchemeInfo(this.selectedStatus.value);
  }

  menuActions = []

  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

  initButton() {
    this.optionsButtonsView = this.detailInfo.actions.map(item => {
      return {
        label: item.name,
        value: item.code,
        icon: item.icon
      }
    });

    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this.callActions(item.code);
        }
      }
    });
  }
  
}

  
  


