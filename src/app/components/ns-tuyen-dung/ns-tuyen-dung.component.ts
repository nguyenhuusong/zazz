
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
import { catchError, forkJoin, fromEvent, Subject, takeUntil, switchMap, tap  } from 'rxjs';
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
    private  employeeSaveService: EmployeeSaveService,
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

  load() {
    this.dataRowSelected = [];
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getCandidatePage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
          }, 100);
        }
        this.spinner.hide();
        var dragTarget = document.getElementById(this.gridKey);
        if(dragTarget) {
          this.FnEvent();
        }
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Chỉnh sửa',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.EDIT)
        },
        {
          onClick: this.chuyenVong.bind(this),
          label: 'Chuyển vòng',
          icon: 'pi pi-reply',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.getRecruitMailInput.bind(this),
          label: 'Gửi email',
          icon: 'pi pi-envelope',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.addAccount.bind(this),
          label: 'Chuyển hồ sơ',
          icon: 'pi pi-reply',
          class: 'btn-primary mr5',
          hide: this.checkHideAddAccount(event)
        },
        {
          onClick: this.rateRecui.bind(this),
          label: 'Đánh giá kết quả',
          icon: 'pi pi-star-fill',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.DANH_GIA_KET_QUA)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa ',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.DELETE) || event.data.can_st === 10
        },
       
      ]
    };
  }

  checkHideAddAccount(params) {
    if((params.data.round_result === 2) && (params.data.status_account === 0)) {
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
      if(dragTarget) {
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
    // this.recruitmentStatusSelected = this.dataRowSelected.map( d => d.can_st).toString();
    this.canSttValue = this.dataRowSelected.sort((a,b)=>a.can_st-b.can_st)[this.dataRowSelected.length - 1];
    // chuyen vong
    this.optionsButtonDB[0].items[0].disabled = this.dataRowSelected.length > 0 ? false : true;
    this.optionsButtonDB[0].items[1].disabled = this.dataRowSelected.length > 0 && this.query.can_st > -1 ? false : true;

    // check role for set tiem nang && check for tuy chon
    // this.optionsButtonDB[0].items[3].disabled = this.dataRowSelected.length > 0 ? false : true;
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ canId: event.rowData.canId });
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

  editRow({rowData}) {
    const params = {
      canId: rowData.canId
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/chi-tiet-tuyen-dung'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  viewRow(event) {
    const params = {
      canId: event.rowData.canId,
      view: true
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/chi-tiet-tuyen-dung'], { queryParams: params });
  }

  addTuyenDung() {
    const params = {
      canId: null
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/them-moi-tuyen-dung'], { queryParams: params });
  }

  getOrgPositions() {
   
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

//   getIPAddress2()
//   {
//     this.http.get('https://jsonip.com')
// .pipe(
//   switchMap((value:any) => {
// 	const userIP = value.ip;
//   console.log("userIP", userIP)
// 	let url = `http://api.ipstack.com/${value.ip.split(',')[0]}?access_key=b1e8a9e4d386d64504f4668e12fc1f68`
// 	return this.http.get(url);
//   })
// ).subscribe(
//   (value:any) => {
// 	console.log(value);
//   },
//   err => {
// 	console.log(err);
//   }
// );
//   }
//   getIPAddress()
//   {
//     this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
//       console.log( res.ip)
//     });
//   }

  ngOnInit() {
    // this.getIPAddress2()
    // this.getIPAddress()
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Danh sách tuyển dụng' },
    ];
    // this.getJobTitles();
    this.getVacancyPage();
    this.getReRound();
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
        badgeStyleClass: 'fffffffffff',
        items: [
          {
            label: 'Chuyển vòng',
            code: 'chuyenVong',
            icon: 'pi pi-reply',
            disabled: false,
            command: () => {
              this.chuyenVong();
            }
          },
          {
            label: 'Gửi email',
            code: 'guiemail',
            icon: 'pi pi-envelope',
            disabled: true,
            command: () => {
              this.getRecruitMailInput();
            }
          },
          {
            label: 'Chuyển hồ sơ',
            code: 'guiemail',
            icon: 'pi pi-reply',
            class: 'hidden',
            command: () => {
              this.setCandidateRegisters();
            }
          },
          // {
          //   label: 'Tiềm năng',
          //   code: 'tiemnang',
          //   icon: 'pi pi-send',
          //   disabled: true,
          //   command: () => {
          //     this.tiemNang();
          //   }
          // },
        ]
      },
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
          // {
          //   label: 'Danh sách tiềm năng',
          //   code: 'Import',
          //   icon: 'pi pi-list',
          //   command: () => {
          //     this.dsTiemNang();
          //   }
          // },
          // {
          //   label: 'Lịch sử tuyển dụng',
          //   code: 'Import',
          //   icon: 'pi pi-list',
          //   command: () => {
          //     this.lsTuyenDung();
          //   }
          // },
        ]
      },
    ]

  }
  isChuyenVong = false;
  chuyenVong() {
    this.isChuyenVong = true;
  }

  addAccount({rowData}) {
    const params = {
      canId : rowData.canId
     }

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn chuyển hồ sơ?',
      accept: () => {
        this.spinner.show();
        this.apiService.setCandidateRegister(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thành công' });
              // this.isSendMail = true;
              // this.getRecruitMailInput();
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message ? results.message : 'Không thành công' });
            }
        })
      }
    })
  }

  setCandidateRegisters() {
    const checks = this.dataRowSelected.filter(d => ((d.round_result === 2) && (d.status_account === 0)));
    if(checks.length > 0) {
      this.confirmationService.confirm({
        message: 'Bạn có chắc chắn muốn tạo tài khoản?',
        accept: () => {
          let listApi = [];
          for(let item of checks) {
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
            this.getRecruitMailInput();
            this.load();
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          })
        }
      })
    }else {
      const stringName = this.dataRowSelected.length > 0 ? this.dataRowSelected.map(d => d.fullName).toString() : ''
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `[${stringName}] bản ghi chưa đủ điều kiện để chuyển hồ sơ ! ` });
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

  getReRound() {
    this.recruitmentStatus = []
    this.apiService.getRecruitRoundTitles(queryString.stringify({ organizeIds: this.organizeIdSelected }))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.recruitmentStatus = results.data.map(d => {
          return {
            label: d.name,
            code: d.value
          }
        });
      }
    })
  }
    
  getVacancyPage() {
    
  }

  getRecruitMailInput(event = null) {
    let canStatus = this.recruitmentStatusSelected
    if(event && event.rowData && event.rowData.can_st) {
      canStatus = event.rowData.can_st
    }
    if(this.dataRowSelected.length > 0) {
      let checkAsynCanId = false;
      // check người dùng chọn theo 1 can_st
      // checkAsynCanId false: theo 1 id, true: có 1 can_st là khác
      let firstCanSt = this.dataRowSelected[0].can_st;
      checkAsynCanId = this.dataRowSelected.some( d => d.can_st !== firstCanSt);

      if(!checkAsynCanId) {
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
            if(this.mailsInput.length === 0) {
              this.isSendMail = false;
              this.isChuyenVong = false;
            }
          }
        })
      }else{
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chuyển vòng trước khi gửi mail' });
      }

    }


  }

  changeRecruStatus() {

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn chuyển vòng?',
      accept: () => {
        let dataUpdateStatus = this.dataRowSelected.map( d => d.canId)
        .toString();
        let vacancyId = this.dataRowSelected.map( d => d.vacancyId)
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
            this.getRecruitMailInput();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Chuyển thành công!' });
            this.isSendMail = true;
            this.isChuyenVong = false;
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
    if(this.queryRate.canId && this.queryRate.InterviewResult) { 
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
    }else if(!this.queryRate.InterviewResult) {
      return;
    }
  }

  cancelSendEmail() {
    this.isSendMail = false;
    this.load();
  }

  sendEmail() {
    if(!this.mailInputValue) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nội dung gửi' });
      return
    }
    let canId = this.dataRowSelected.map( d => d.canId).toString()
    const data = {
      tempId: this.mailInputValue,
      canIds: canId,
      can_st: this.sentEmail ? this.query.can_st : this.recruitmentStatusSelected
    }
    // this.employeeSaveService.setStocks(data);
    localStorage.setItem('RecruitMail', JSON.stringify(data))
    this.router.navigate(['/cai-dat/thong-bao/them-moi-thong-bao'], { queryParams: {external_name: ''} })
    this.sentEmail = false;

    // this.spinner.show();
    // this.apiService.sendRecruitMail(data)
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(results => {
    //   if (results.status === 'success') {
    //     this.sentEmail = true;
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Gửi thành công' });
    //     this.mailInputValue = '';
    //     this.dataRowSelected = [];
        
    //     this.spinner.hide();
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.data : null });
    //   }
    // })
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
    this.queryTiemNang.canId = this.dataRowSelected.map( d => d.canId).toString();
  }

  setTiemNang() {
    this.isSubmitTiemNang = true;
    if(!this.queryTiemNang.reason_rejiect){
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
    // this.optionsButtonDB[1].disabled = true;
    this.isSendMail = false;
    // this.dataRowSelected = [];
    // this.load();
    this.FnEvent();
  }

  isUploadImage = false;
  formData = new FormData();
  onSelectFile(event, type) {
    if(type === 1) {
      this.formData.append('front_file', event.currentFiles[0]);
    }else{
      this.formData.append('back_file', event.currentFiles[0]);
    }
    
  }
  sendImages() {
    this.apiService.imgaetest(this.formData)
    .subscribe(results => {
      console.log('results', results)
    } )
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
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
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

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.query = { ...this.query, ...params};
      this.load();
      this.FnEvent();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
  }

}


