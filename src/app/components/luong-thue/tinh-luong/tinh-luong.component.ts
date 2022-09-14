import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-tinh-luong',
  templateUrl: './tinh-luong.component.html',
  styleUrls: ['./tinh-luong.component.scss']
})
export class TinhLuongComponent implements OnInit {
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
    private readonly unsubscribe$: Subject<void> = new Subject();
  displayOrganize = false;
  listAgencyMap: TreeNode[];
  displayButton = false;
  detailOrganizeMap = null;
  isHrDiagram: boolean = false
  displaySetting = false;
  gridKey = ''
  tabIndex = 0;
  cauhinh() {
    this.displaySetting = true;
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Lương - thuế' },
      { label: 'Thiết lập tham Số' },
    ];
    this.getOrgan();
    this.itemsToolOfGrid = [
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          // this.exportExel();
        }
      },
    ]
  }

  checkTitleAddNew() {
    if(this.tabIndex === 0){
      this.titleAddnew = 'Thêm mới bảng lương';
      this.items[this.items.length - 1] = 'Bảng lương';
    }else if(this.tabIndex === 1){
      this.titleAddnew = 'Thêm mới thiết lâp tham số';
      this.items[this.items.length - 1] = 'Thiết lâp tham số';
    }else if(this.tabIndex === 2){
      this.titleAddnew = 'Thêm mới thành phần lương';
      this.items[this.items.length-1] = 'Thành phần lương';
    }else if(this.tabIndex === 3){
      this.titleAddnew = 'Thêm mới loại bảng lương';
      this.items[this.items.length-1] = 'Loại bảng lương';
    }
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
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
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
    this.apiService.getOrganizations(queryParams).subscribe(results => {
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
    this.checkTitleAddNew()
  }
  isNew = false
  addNew() {
    this.isAddNew = true;
    this.isNew = true;
    if(this.tabIndex === 0){
    }else if(this.tabIndex === 1){
    }else if(this.tabIndex === 2){
      this.getHrmPayrollAttributeInfo();
    }else if(this.tabIndex === 3){
      this.getHrmPayrollTypeInfo();
    }
  }

  // thanh phan luong
  getHrmPayrollAttributeInfo(id = null){
    const queryParams = queryString.stringify({ Id: id })
    this.apiService.getHrmPayrollAttributeInfo(queryParams).subscribe( results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = cloneDeep(listViews);
        this.detailInfo = results.data;
      }
    })
  }
  
  // loai bang luong
  getHrmPayrollTypeInfo(id = null) {
    const queryParams = queryString.stringify({ Id: id })
    this.apiService.getHrmPayrollTypeInfo(queryParams).subscribe( results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = cloneDeep(listViews);
        this.detailInfo = results.data;
        this.ngOnInit();
      }
    })
  }

  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  handleSave(event) {
    if(this.tabIndex === 0){
    }else if(this.tabIndex === 1){
    }else if(this.tabIndex === 2){
      this.getHrmPayrollTypeInfo();
    }else if(this.tabIndex === 3){
      this.setHrmPayrollTypeInfo(event);
    }
  }

  // loai bang luong
  setHrmPayrollTypeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.spinner.show();
    this.apiService.setHrmPayrollTypeInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.isNew = false;
          this.tabIndex = this.tabIndex;
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      }; 
  }

  quaylai(event){
    this.isNew = false
  }
  
  getIsNewPopup(event){
    this.isNew = event
  }

}
