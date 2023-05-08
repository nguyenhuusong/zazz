import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction, AgGridFn } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
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
    this.initMenu();
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Danh sách tuyển dụng', routerLink: '/tuyen-dung/ds-tuyen-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }

  initMenu() {
    this.menuActions = [
      {
        label: 'Lưu lại',
        icon: 'pi pi-check',
        command: () => {
          this.fnSave('newUpdate');
        }
      },
      {
        label: 'Tạo hồ sơ cá nhân',
        icon: 'pi pi-send',
        command: () => {
          this.fnSaveProfile();
        }
      },
    ]
  };

  fnSave(id) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById('newUpdate');
      s.click();
    }, 500);
  }

  fnSaveProfile() {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById('CreateProfile');
      s.click();
    }, 500);
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
          this.optionsButon = [
            { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tạo hồ sơ cá nhân', value: 'CreateProfile', class: `p-button-success ${this.custId ? 'hidden' : ''}`, icon: 'pi pi-send' },
            { label: 'Lưu lại', value: 'newUpdate', class: 'newUpdate', icon: 'pi pi-check' }
          ]
          this.detailEdit = results.data
        }
      });
  }

  getCandidateInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getCandidateInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.custId = results.data.custId;
          this.status = results.data.flowStatuses
          this.selectedCountry = this.status[0];
          this.optionsButon = [
            { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
            { label: 'Tạo hồ sơ cá nhân', value: 'CreateProfile', class: `p-button-success ${this.custId ? 'hidden' : ''}`, icon: 'pi pi-send' },
            { label: 'Lưu lại', value: 'newUpdate', class: 'newUpdate', icon: 'pi pi-check' }
          ]
          this.detailEdit = results.data
        }
      });
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
  setCandidateInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
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


