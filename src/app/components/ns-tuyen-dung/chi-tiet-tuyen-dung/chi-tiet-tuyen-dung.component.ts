import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction, AgGridFn } from 'src/app/common/function-common/common';
import { stringify } from 'querystring';
@Component({
  selector: 'app-chi-tiet-tuyen-dung',
  templateUrl: './chi-tiet-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-tuyen-dung.component.scss']
})
export class ChiTietTuyenDungComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  selectedCountry: any = {};
  status = [
    {
      name: 'IN PROGRESS',
      placeholder: 'Doing',
      value: 1,
      textColor: 'inprogress',
      bgcolor: 'bgInprogress'
    },
    {
      name: 'TO DO',
      placeholder: 'To do',
      value: 1,
      textColor: 'todo',
      bgcolor: 'bgTodo'
    },
    {
      name: 'UN-DO',
      placeholder: 'Transiton to',
      value: 2,
      textColor: 'undo',
      bgcolor: 'bgUndo'
    },

  ]
  paramsObject = null;
  detailInfo = null
  listViews = [];
  displayAddCCCD = false;
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Tạo hồ sơ cá nhân', value: 'CreateProfile', class: 'p-button-success', icon: 'pi pi-send' },
    { label: 'Lưu lại', value: 'newUpdate', class: 'newUpdate', icon: 'pi pi-check' }
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private changeDetech: ChangeDetectorRef,

  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
  }


  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Danh sách tuyển dụng', routerLink: '/tuyen-dung/ds-tuyen-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }


  menuActions = [];
  modelEdit = {
    canId: null,
  }
  displayCustomerProfile = false;
  custId = null;
  titlePage = '';
  isView = false;
  columnDefs = [];
  listData = [];
  heightGrid = 300;
  gridKey = '';
  cols = [];
  detailEdit = null;
  fromHistory: boolean = false;
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.canId = this.paramsObject.params.canId || null;
        this.isView = this.paramsObject.params.view
        this.fromHistory = this.paramsObject.params.fromHistory;
        if (this.fromHistory) {
          this.removeBtn('CreateProfile')
        }
        if (!this.isView) {
          this.getCandidateInfo();
        } else {
          this.getCandidatesViewInfo();
        }
      });
  };

  removeBtn(value) {
    if (value) {
      this.optionsButon = this.optionsButon.filter(d => d.value !== value)
    }
  }

  cloneListViews = []
  callBackForm(event) {
    console.log('fodsijfid', event)
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setCandidateDraft(params);
    }
  }

  setCandidateDraft(params) {
    this.apiService.setCandidateDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.custId = results.data.custId;
          // this.optionsButon = [
          //   { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
          //   { label: 'Tạo hồ sơ cá nhân', value: 'CreateProfile', class: `p-button-success ${this.custId ? 'hidden' : ''}`, icon: 'pi pi-send' },
          //   { label: 'Lưu lại', value: 'newUpdate', class: 'newUpdate', icon: 'pi pi-check' }
          // ]
          this.detailEdit = results.data
        }
      });
  }

  recruiUpdateStatus() {
    const params = {
      canId: this.detailInfo.canId,
      can_st: this.selectedCountry.value,
      vacancyId: this.detailInfo.vacancyId
    }
    this.apiService.recruiUpdateStatus(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Chuyển thành công!' });
          this.getCandidateInfo();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
        }
      });
  }

  getCandidateInfo() {
    this.listViews = [];
    this.status = [];
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getCandidateInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.custId = results.data.custId;
          this.status = results.data.flowStatuses || [];
          if(results.data.status) this.status.push(results.data.status);
          this.selectedCountry = results.data.status;
          if(this.detailInfo.actions && this.detailInfo.actions.length > 0) {
            this.initButton();
          }
          this.detailEdit = results.data
        }
      });
  }

  initButton() {
    this.optionsButon = this.detailInfo.actions.map(item => {
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

  callActions(code) {
    console.log(code)
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

  tabIndex: number = 0;
  handleChange(index) {
    this.tabIndex = index;
  }

  getCandidatesViewInfo() {
    this.columnDefs = [];
    this.listData = []
    const query = { canId: this.modelEdit.canId }
    this.apiService.getCandidatesViewInfo(stringify(query))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.cols = results.data.gridflexdetails1;
          this.listData = results.data.recruitCandidates;
          this.custId = results.data.custId;
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.initGrid();
        }
      });

    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getCandidateInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.detailEdit = results.data
        }
      });
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
  }

  setCandidateInfo(e) {
    // tạo hàm từ code api trả ra
    this[e.event](e)
  }

  actAddProfile(e) {
    this.displayAddCCCD = true;
  }

  // actSendMail(e) {
  //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chức năng đang phát triển !' });
  // }
  isSendMail = false;
  mailsInput = [];
  mailInputValue = null;
  actSendMail(e) {
    this.apiService.getRecruitMailInput(queryString.stringify({ can_st: this.detailInfo.flow_st }))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.mailsInput = results.data.map(d => {
            return {
              label: d.name,
              value: d.value
            }
          });
          if (this.mailsInput.length > 0) {
            this.isSendMail = true;
          }
        }
      })
  }

  sendEmail() {
    if (!this.mailInputValue) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nội dung gửi' });
      return
    }
    const data = {
      tempId: this.mailInputValue,
      canIds: this.detailInfo.canId,
      can_st: this.detailInfo.flow_st
    }
    localStorage.setItem('RecruitMail', JSON.stringify(data))
    this.router.navigate(['/cai-dat/thong-bao/them-moi-thong-bao'], { queryParams: { external_name: '' } })
    this.isSendMail = false;
  }


  actRegEmpUser(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn tạo tài khoản?',
      accept: () => {
        this.spinner.show();
        const param = {
          canId: this.detailInfo.canId
        }
        this.apiService.setCandidateRegister(param).subscribe((result: any) => {
          if(result.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: result.message ? result.message : 'Tạo tài khoản thành công ' });
          }else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: result.message ? result.message : 'Thất bại' });
          }
        })
      }
    })
  }

  actSave(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event.datas
    }
    this.apiService.setCandidateInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/tuyen-dung/ds-tuyen-dung']);
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }





  quaylai(data) {
    if (data === 'CauHinh') {
      this.getCandidateInfo();
    } else if (data === 'CreateProfile') {
      this.displayAddCCCD = true;
    } else {
      this.router.navigate(['/tuyen-dung/ds-tuyen-dung']);
    }
  }

  callbackSaveProfile() {
    this.displayCustomerProfile = false;
    this.getCandidateInfo();
  }

  saveCCCD(event) {
    this.custId = event;
    setTimeout(() => {
      this.tabIndex = 1
      this.modelEdit.canId = event
      this.displayAddCCCD = false;
    }, 100);
  }


}


