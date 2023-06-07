import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { TabBangLuongComponent } from './tab-bang-luong/tab-bang-luong.component';
import { TabThietLapThamSoComponent } from './tab-thiet-lap-tham-so/tab-thiet-lap-tham-so.component';
import { TabThanhPhanLuongComponent } from './tab-thanh-phan-luong/tab-thanh-phan-luong.component';
import { TabCapBacLuongComponent } from './tab-cap-bac-luong/tab-cap-bac-luong.component';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-tinh-luong',
  templateUrl: './tinh-luong.component.html',
  styleUrls: ['./tinh-luong.component.scss']
})
export class TinhLuongComponent implements OnInit {
  @ViewChild('tabBangLuong') tabBangLuong: TabBangLuongComponent;
  @ViewChild('tabThietLapThamSo') tabThietLapThamSo: TabThietLapThamSoComponent;
  @ViewChild('tabThanhPhanLuong') tabThanhPhanLuong: TabThanhPhanLuongComponent;
  @ViewChild('TabCapBacLuongComponent') TabCapBacLuongComponent: TabCapBacLuongComponent;

  tabsItem = []
  pagingComponent = {
    total: 0
  };
  items = [];
  selectedNode
  orgId
  organs = []
  itemsToolOfGrid: any[] = [];
  titleAddnew = '';
  listViews = []
  detailInfo = []
  isAddNew

  isFormDetail = false;
  idForm = null;

  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fileService: ExportFileService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {
  }
  query = {
    filter: ''
  }
  private readonly unsubscribe$: Subject<void> = new Subject();
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  displayButton = false;
  detailOrganizeMap = null;
  isHrDiagram: boolean = false
  displaySetting = false;
  gridKey = ''
  tabIndex = 0;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  isAddNewButton = false;
  cauhinh() {
    this.displaySetting = true;
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Lương - thuế' },
      { label: 'Thiết lập tham Số' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          this.ExportExcel();
        }
      },
    ]
    this.checkIsAddNew();
    this.checkTitleAddNew();
  }

  importFileExel() {
    if(this.tabIndex === 2) {
      this.router.navigate(['/luong-thue/tinh-luong/import-thanh-phan-luong']);
    }else if(this.tabIndex === 3) { 
      this.router.navigate(['/luong-thue/tinh-luong/import-cap-bac-luong']);
    }
  }

  ExportExcel() {
    this.spinner.show();
    let params = {...this.query};
    this.apiService.setPayrollBaseExport(queryString.stringify({ ...params }))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else if (results.type === 'application/octet-stream') {
        var blob = new Blob([results], { type: 'application/msword' });
        FileSaver.saveAs(blob, `Danh sách cấp bậc lương` + ".xlsx");
        this.spinner.hide();
      }
    })
  }

  checkIsAddNew() {
    if (this.tabIndex === 0 && !CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.ADD_TINH_LUONG_BANG_LUONG)) {
      this.isAddNewButton = true;
    } else if (this.tabIndex === 1 && !CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.ADD_TINH_LUONG_THIET_LAP_THAM_SO)) {
      this.isAddNewButton = true;
    } else if (this.tabIndex === 2 && !CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.ADD_TINH_LUONG_THANH_PHAN_LUONG)) {
      this.isAddNewButton = true;
    } else if (this.tabIndex === 3 && !CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.ADD_TINH_LUONG_CAP_BAC_LUONG)) {
      this.isAddNewButton = true;
    } else {
      this.isAddNewButton = false;
    }
  }

  editEvent(rowData) {
    let id = null;
    if (this.tabIndex === 0) {
      this.idForm = rowData.appInfoId
    } else if (this.tabIndex === 1) {
      this.idForm = rowData.id
    } else if (this.tabIndex === 2) {
      this.idForm = rowData.componentId
    } else if (this.tabIndex === 3) {
      this.idForm = rowData.baseId
    }
    this.isFormDetail = true;

    // const queryParams = queryString.stringify({ recordId: event.rowData.id });
    // this.apiService.getPayrollAppInfo(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listViews = cloneDeep(results.data.group_fields);
    //     this.detailInfo = results.data;
    //   }
    // })
  }

  isNew = false
  addNew() {
    if (this.tabIndex === 0) {
      this.isFormDetail = true;
      this.idForm = null
    } else if (this.tabIndex === 1) {
      this.isFormDetail = true;
      this.idForm = null
    } else if (this.tabIndex === 2) {
      this.isFormDetail = true;
      this.idForm = null
    } else if (this.tabIndex === 3) {
      this.isFormDetail = true;
      this.idForm = null
    }
  }

  checkTitleAddNew() {
    const itemBread = cloneDeep(this.items);
    this.items = [];
    if (this.tabIndex === 0) {
      this.titleAddnew = 'Bảng lương';
      itemBread[itemBread.length - 1].label = 'Bảng lương';
    } else if (this.tabIndex === 1) {
      this.titleAddnew = 'Thiết lâp tham số';
      itemBread[itemBread.length - 1].label = 'Thiết lâp tham số';
    } else if (this.tabIndex === 2) {
      this.titleAddnew = 'Thành phần lương';
      itemBread[itemBread.length - 1].label = 'Thành phần lương';
    } else if (this.tabIndex === 3) {
      this.titleAddnew = 'Cấp bậc lương';
      itemBread[itemBread.length - 1].label = 'Cấp bậc lương';
    }
    this.items = itemBread
  }

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
    this.getAgencyOrganizeMap(true);
  }

  changeOrigin() {
    this.tabIndex = 0
  }

  getAgencyOrganizeMap(type = false) {
    this.apiService.getAgencyOrganizeMap()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          if (type) {
            this.isHrDiagram = true;
          }
        }
      }
    })
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }

  getContextMenuItems(params) {
    var result = [
      'copy',
      'paste',
      'separator',
    ];
    return result;
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  getOrgan() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.organs = results.data.map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        this.organs = [...this.organs];
      }
    })
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    // const a: any = document.querySelector(".header");
    // const b: any = document.querySelector(".sidebarBody");
    // const c: any = document.querySelector(".bread-filter");
    // const d: any = document.querySelector(".bread-crumb");
    // const e: any = document.querySelector(".paginator");
    // this.loadjs++
    // if (this.loadjs === 5) {
    //   if (b && b.clientHeight) {
    //     const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight +10;
    //     this.heightGrid = window.innerHeight - totalHeight
    //     this.changeDetector.detectChanges();
    //   } else {
    //     this.loadjs = 0;
    //   }
    // }
  }

  handleChange(e) {
    this.tabIndex = e;
    this.checkTitleAddNew();
    this.checkIsAddNew();
  }


  // thanh phan luong
  getHrmPayrollAttributeInfo(id = null) {
    const queryParams = queryString.stringify({ Id: id })
    this.apiService.getHrmPayrollAttributeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = cloneDeep(listViews);
        this.detailInfo = results.data;
      }
    })
  }
  
  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  // from detail
  theEventDetail(event) {
    this.isFormDetail = false;
    if (this.tabIndex === 0) {
      this.tabBangLuong.load();
    }
    if (this.tabIndex === 1) {
      this.tabThietLapThamSo.load();
    }
    if (this.tabIndex === 2) {
      this.tabThanhPhanLuong.load();
    }
    if (this.tabIndex === 3) {
      this.TabCapBacLuongComponent.load();
    }

  }

}
