
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { catchError, forkJoin, fromEvent, Subject, takeUntil, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EmployeeSaveService } from 'src/app/services/employee-save.service';

@Component({
  selector: 'app-ns-tuyen-dung',
  templateUrl: './ns-tuyen-dung.component.html',
  styleUrls: ['./ns-tuyen-dung.component.scss']
})
export class NsTuyenDungComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  items = []
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private employeeSaveService: EmployeeSaveService,
    private changeDetector: ChangeDetectorRef,

    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
    this.getCandidateFilter();
  }
  pagingComponent = {
    total: 0
  }
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    can_st: -1
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false;
  listVacancy = [];
  recruitmentStatus = [

  ]
  recruitmentStatusSelected = null;
  dataRowSelected: any = []
  isSendMail = false;
  mailsInput = [];
  mailInputValue: any = [];
  buttonTiemNang = [];
  optionsButtonDB: any = [];
  loadjs = 0;
  heightGrid = 450;

  // sentEmail gửi email thành công
  sentEmail = false;

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // the value for check disabled 'Chuyển vòng radio'
  canSttValue: any = null
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
      can_st: -1
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }
  listActions = [];
  load() {
    this.dataRowSelected = [];
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getCandidatePage(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList;
          this.gridKey = results.data.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
            this.listActions = results.data.can_actions;
            this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
          }
          this.initGrid();
          this.countRecord.totalRecord = results.data.recordsTotal;
          this.countRecord.totalRecord = results.data.recordsTotal;
          this.countRecord.currentRecordStart = results.data.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
          if ((results.data.recordsTotal - this.query.offSet) > this.query.pageSize) {
            this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
          } else {
            this.countRecord.currentRecordEnd = results.data.recordsTotal;
            setTimeout(() => {
              const noData = document.querySelector('.ag-overlay-no-rows-center');
              if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
            }, 100);
          }
          this.spinner.hide();
          var dragTarget = document.getElementById(this.gridKey);
          if (dragTarget) {
            this.FnEvent();
          }
        },
        error => {
          this.spinner.hide();
        });
  }
  displayAddCCCD = false;
  canId: string = '';
  saveCCCD() {
    this.displayAddCCCD = false;
    this.find();
  }

  actAddProfile(event) {
    if (event) {
      this.dataRowSelected = [];
      this.dataRowSelected.push(event.rowData);
    }
    this.canId = this.dataRowSelected[0].canId
    this.displayAddCCCD = true;
  }

  showButtons(event: any) {
    const actions = this.listActions.filter(d => d.canId === event.data.canId)[0].actions;
    return {
      buttons: actions.map(item => {
        return {
          onClick: this[item.code]?.bind(this),
          label: item.name,
          icon: item.icon,
          action_url: item.action_url,
          tick: item.tick
        }
      })
    }
  }

  checkHideAddAccount(params) {
    if ((params.data.round_result === 2) && (params.data.status_account === 0)) {
      return false;
    }
    return true;
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addTuyenDung()
        });
      }
    }, 300);
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: '',
        width: 60,
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        field: 'checkbox2',
        headerCheckboxSelection: true,
        suppressSizeToFit: true,
        suppressRowClickSelection: true,
        showDisabledCheckboxes: true,
        checkboxSelection: true,
        // rowSelection: 'single'
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
            `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.Owns);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.Owns.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  rowSelected(event) {
    this.dataRowSelected = event;
  }

  actDelete(event) {
    if(event) {
      this.dataRowSelected = [];
      this.dataRowSelected.push(event.rowData)
    }
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ canId: this.dataRowSelected[0].canId });
        this.apiService.delCandidateInfo(queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa tuyển dụng thành công' });
              this.load();
              this.FnEvent();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
      }
    });
  }

  actEdit(event) {
    if (event) {
      this.dataRowSelected = [];
      this.dataRowSelected.push(event.rowData);
    }
    const params = {
      canId: this.dataRowSelected[0].canId
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/chi-tiet-tuyen-dung'], { queryParams: params });
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.actEdit(event = { rowData: event.data })
    }
  }

  addTuyenDung() {
    const params = {
      canId: null
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/them-moi-tuyen-dung'], { queryParams: params });
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }
  organizeIdSelected = '';


  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Danh sách tuyển dụng' },
    ];
    this.buttonTiemNang = [
      {
        label: 'Danh sách tiềm năng',
        code: 'Import',
        icon: 'pi pi-list',
        command: () => {
          this.dsTiemNang();
        }
      },
      {
        label: 'Tiềm năng',
        code: 'tiemnang',
        icon: 'pi pi-send',
        disabled: true,
        command: () => {
          this.tiemNang();
        }
      },
    ];

    this.optionsButtonDB = [
      {
        items: [
          {
            label: 'Import',
            code: 'import',
            icon: 'pi pi-file-excel',
            disabled: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.IMPORT),
            command: () => {
              this.importFileExel();
            }
          },
        ]
      },
    ]

  }
  isChuyenVong = false;
  actStatus(event) {
    if (event) {
      this.dataRowSelected = [];
      this.dataRowSelected.push(event.rowData)
    }
    this.getReRound(event.rowData.can_st);
  }

  actRegEmpUser(event) {
    if (event) {
      this.dataRowSelected = [];
      this.dataRowSelected.push(event.rowData)
    }
    this.setCandidateRegisters();
  }

  setCandidateRegisters() {
    if (this.dataRowSelected.length > 0) {
      this.confirmationService.confirm({
        message: 'Bạn có chắc chắn muốn tạo tài khoản?',
        accept: () => {
          let listApi = [];
          for (let item of this.dataRowSelected) {
            const param = {
              canId: item.canId
            }
            listApi.push(this.apiService.setCandidateRegister(param).subscribe(error => error))
          }

          this.spinner.show();
          forkJoin(listApi)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(result => {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thành công' });
              this.actSendMail();
              this.load();
              this.spinner.hide();
            }, error => {
              this.spinner.hide();
            })
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Chưa chọn bản ghi nào` });
    }
  }

  listJobTitles = [];
  positions = [{ label: 'Tất cả', value: null }];
  getJobTitles() {
    this.apiService.getJobTitles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listJobTitles = results.data.map(d => {
            return {
              label: d.job_name,
              value: d.jobId
            }
          });
          this.listJobTitles = [{ label: 'Tất cả', value: null }, ...this.listJobTitles]
        }
      })
  }

  listStatus = []
  getStatus() {
    const queryParams = queryString.stringify({ objKey: 'recruitment_round' });
    this.apiService.getCustObjectListNew(false, queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listStatus = results.data.map(d => {
            return {
              label: d.objName,
              value: d.objValue
            }
          });
          this.listStatus = [{ label: 'Tất cả', value: null }, ...this.listStatus];
        }
      })
  }

  getReRound(round_value) {
    this.recruitmentStatus = []
    this.apiService.getRecruitRoundStatus(queryString.stringify({ round_value: round_value }))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.recruitmentStatus = results.data;
          if(this.recruitmentStatus.length > 0) {
            this.isChuyenVong = true;
          }else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Bản ghi đang ở trạng thái chưa chuyển được vòng` });
          }
        }
      })
  }

  getRecruitActions() {
    if (this.dataRowSelected.length > 0) {
      const canIds = this.dataRowSelected.map(item => item.canId);
      this.apiService.getRecruitActions(queryString.stringify({ canIds: canIds }))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success' && results.data.length > 0) {
            this.optionsButtonDB = this.optionsButtonDB.length > 1 ? this.optionsButtonDB.splice(0, 1) : this.optionsButtonDB;
            const menuActions = results.data.map(item => {
              return {
                label: item.name,
                code: item.code,
                icon: item.icon,
                disabled: false,
                command: () => {
                  this[item.code]();
                }
              }
            })
            this.optionsButtonDB.push({
              badgeStyleClass: 'fffffffffff',
              items: menuActions
            })

          }
        })
    } else {
    }

  }

  actSendMail(event = null) {
    let canStatus = this.recruitmentStatusSelected
    if (event && event.rowData && event.rowData.can_st) {
      canStatus = event.rowData.can_st
    }
    if (this.dataRowSelected.length > 0) {
      let checkAsynCanId = false;
      // check người dùng chọn theo 1 can_st
      // checkAsynCanId false: theo 1 id, true: có 1 can_st là khác
      let firstCanSt = this.dataRowSelected[0].can_st;
      checkAsynCanId = this.dataRowSelected.some(d => d.can_st !== firstCanSt);

      if (!checkAsynCanId) {
        this.isSendMail = true;
        this.apiService.getRecruitMailInput(queryString.stringify({ can_st: canStatus ? canStatus : firstCanSt }))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.recruitmentStatusSelected = canStatus ? canStatus : firstCanSt
              this.mailsInput = results.data.map(d => {
                return {
                  label: d.name,
                  value: d.value
                }
              });
              if (this.mailsInput.length === 0) {
                this.isSendMail = false;
                this.isChuyenVong = false;
              }
            }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chuyển vòng trước khi gửi mail' });
      }
    }
  }

  changeRecruStatus() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn chuyển vòng?',
      accept: () => {
        let dataUpdateStatus = this.dataRowSelected.map(d => d.canId)
          .toString();
        let vacancyId = this.dataRowSelected.map(d => d.vacancyId)
          .toString();
        const query = {
          canId: dataUpdateStatus,
          can_st: this.recruitmentStatusSelected,
          vacancyId: vacancyId
        }
        const data = {
          tempId: null,
          canIds: dataUpdateStatus,
          can_st: this.recruitmentStatusSelected
        }

        localStorage.setItem('RecruitMail', JSON.stringify(data))
        this.apiService.recruiUpdateStatus(queryString.stringify(query))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results: any) => {
            if (results.status === 'success') {
              this.actSendMail();
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Chuyển thành công!' });
              this.isSendMail = true;
              this.isChuyenVong = false;
              this.load();
            } else {
              this.isChuyenVong = false;
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
      },
    });
  }
  isRateRecui = false;
  rateStatus = null;
  queryRate = {
    canId: '',
    InterviewResult: '',
  }
  isSubmitRate = false;
  rateRecui(event) {
    this.isRateRecui = true;
    this.queryRate.canId = event.rowData.canId
  }

  cancelRate() {
    this.isRateRecui = false
  }

  sendRate() {
    this.isSubmitRate = true;
    if (this.queryRate.canId && this.queryRate.InterviewResult) {
      this.apiService.updateInterviewResult(queryString.stringify(this.queryRate), null)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Gửi thành công' });
            this.isRateRecui = false;
            this.isSubmitRate = false;
            this.spinner.hide();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.data : null });
          }
        })
    } else if (!this.queryRate.InterviewResult) {
      return;
    }
  }

  cancelSendEmail() {
    this.isSendMail = false;
    this.load();
  }

  sendEmail() {
    if (!this.mailInputValue) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nội dung gửi' });
      return
    }
    let canId = this.dataRowSelected.map(d => d.canId).toString()
    const data = {
      tempId: this.mailInputValue,
      canIds: canId,
      can_st: this.sentEmail ? this.query.can_st : this.recruitmentStatusSelected
    }
    localStorage.setItem('RecruitMail', JSON.stringify(data))
    this.router.navigate(['/cai-dat/thong-bao/them-moi-thong-bao'], { queryParams: { external_name: '' } })
    this.sentEmail = false;
  }

  themLichHop() {
    const params = {
      meet_ud: null
    }
    return this.router.navigate(['/cai-dat/cai-dat-lich-hop/them-moi-lich-hop'], { queryParams: params });
  }

  isSubmitTiemNang = false;
  isTiemNang = false;
  queryTiemNang = {
    canId: '',
    reason_rejiect: '',
  }

  tiemNang() {
    this.isTiemNang = true;
    this.queryTiemNang.canId = this.dataRowSelected.map(d => d.canId).toString();
  }

  setTiemNang() {
    this.isSubmitTiemNang = true;
    if (!this.queryTiemNang.reason_rejiect) {
      return;
    }
    this.apiService.updateCandidatesPotential(queryString.stringify(this.queryTiemNang), null)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thành công' });
          this.load();
          this.FnEvent();
          this.isTiemNang = false;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.data : null });
        }
      })
  }

  canSetTiemNang() {
    this.isTiemNang = false;
  }

  dsTiemNang() {
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/ds-tiem-nang']);
  }

  lsTuyenDung() {
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/lich-su-tuyen-dung']);
  }

  // vitrituyendung() {
  //   this.router.navigate(['/tuyen-dung/danh-sach-tuyen-dung/vi-tri-tuyen-dung']);
  // }

  // linhvuctuyendung() {
  //   this.router.navigate(['/tuyen-dung/danh-sach-tuyen-dung/linh-vuc-tuyen-dung']);
  // }

  onHideSendEmail(event) {
    this.isSendMail = false;
    this.FnEvent();
  }

  isUploadImage = false;
  formData = new FormData();
  onSelectFile(event, type) {
    if (type === 1) {
      this.formData.append('front_file', event.currentFiles[0]);
    } else {
      this.formData.append('back_file', event.currentFiles[0]);
    }

  }
  sendImages() {
    this.apiService.imgaetest(this.formData)
      .subscribe(results => {
        console.log('results', results)
      })
  }
  importFileExel() {
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/import-tuyen-dung']);
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  getCandidateFilter() {
    this.apiService.getCandidateFilter()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.cloneListViewsFilter = cloneDeep(listViews);
          this.listViewsFilter = [...listViews];
          const params = getParamString(listViews)
          this.query = { ...this.query, ...params };
          this.load();
          this.FnEvent();
          this.detailInfoFilter = results.data;
        }
      });
  }

  filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
    this.FnEvent();
  }

  close({ event, datas }) {
    if (event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params = getParamString(listViews)
      this.query = { ...this.query, ...params };
      this.load();
      this.FnEvent();
    } else {
      this.listViewsFilter = cloneDeep(datas);
    }
  }

}


