import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { VongTuyenDungComponent } from './vong-tuyen-dung/vong-tuyen-dung.component';
import { NsCauHinhMailComponent } from './ns-cau-hinh-mail/ns-cau-hinh-mail.component';
import { NguonTuyenDungComponent } from './nguon-tuyen-dung/nguon-tuyen-dung.component';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
@Component({
  selector: 'app-ns-cau-hinh',
  templateUrl: './ns-cau-hinh.component.html',
  styleUrls: ['./ns-cau-hinh.component.scss']
})
export class NsCauHinhComponent implements OnInit {
  @ViewChild('nsCauHinhMail') tabNsCauHinhMail: NsCauHinhMailComponent;
  @ViewChild('vongTuyenDung') tabVongTuyenDung: VongTuyenDungComponent;
  @ViewChild('nguonTuyenDung') tabNguonTuyenDung: NguonTuyenDungComponent;
  
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
    private organizeInfoService: OrganizeInfoService,
    private router: Router) {
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
      { label: 'Tuyển dụng' },
      { label: 'Cấu hình' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.IMPORT),
        command: () => {
          // this.exportExel();
        }
      },
    ]
  }


  editEvent(event) {
    let id = null;
    if(this.tabIndex === 0){
      this.idForm = event.rowData.mail_Id
    }else if(this.tabIndex === 1){
      this.idForm = event.rowData.Id
    }else if(this.tabIndex === 2){
      this.idForm = event.rowData.source_Id
    }
    this.isFormDetail = true;
    
    const queryParams = queryString.stringify({recordId: event.rowData.id});
    // this.apiService.getPayrollAppInfo(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.listViews = cloneDeep(results.data.group_fields);
    //     this.detailInfo = results.data;
    //   }
    // })
  }

  isNew = false
  addNew() {
    if(this.tabIndex === 0){
      this.isFormDetail = true;
      this.idForm = null
    }else if(this.tabIndex === 1){
      this.popupWidth = 1200
      this.isFormDetail = true;
      this.idForm = null
    }else if(this.tabIndex === 2){
      this.popupWidth = 1200
      this.isFormDetail = true;
      this.idForm = null
    }
  }
  popupWidth = 1800;
  checkTitleAddNew() {
    if(this.tabIndex === 0){
      // this.titleAddnew = 'Cấu hình mail';
      // this.items[this.items.length - 1] = 'Cấu hình mail';
      this.popupWidth = 1800
    }else if(this.tabIndex === 1){
      // this.titleAddnew = 'Vòng tuyển dụng';
      // this.items[this.items.length - 1] = 'Vòng tuyển dụng';
      this.popupWidth = 1200
    }else if(this.tabIndex === 2){
      // this.titleAddnew = 'Nguồn tuyển dụng';
      // this.items[this.items.length-1] = 'Nguồn tuyển dụng';
      this.popupWidth = 1200
    }
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }
  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
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
    //     const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
    //     this.heightGrid = window.innerHeight - totalHeight
    //     this.changeDetector.detectChanges();
    //   } else {
    //     this.loadjs = 0;
    //   }
    // }
  }

  handleChange(e){
    this.tabIndex = e;
    this.checkTitleAddNew();
  }
  

  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }


  // from detail
  theEventDetail(event){
     this.isFormDetail = false;
     if(this.tabIndex === 0) {
      this.tabNsCauHinhMail.load();
     }
     if(this.tabIndex === 1) {
      this.tabVongTuyenDung.load();
     }
     if(this.tabIndex === 2) {
      this.tabNguonTuyenDung.load();
     }
     
  }

}
