import { ChangeDetectorRef, Component, Input, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AllModules, ColumnsToolPanelModule, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-tab-loai-bang-luong',
  templateUrl: './tab-loai-bang-luong.component.html',
  styleUrls: ['./tab-loai-bang-luong.component.scss']
})
export class TabLoaiBangLuongComponent implements OnInit {
  @Input() organizeId: null
  @Input() isNew: boolean = false
  @Output() offIsNewPopup = new EventEmitter<any>();
  public agGridFn = AgGridFn;
  items = [];
  columnDefs = [];
  isEdit = false
  defaultColDef;
  frameworkComponents;
  gridApi: any;
  gridflexs: any;
  listsData = null;
  totalRecord = 0;
  first = 0;
  listViews = []
  detailInfo = []
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  itemsToolOfGrid: any[] = [];
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
  query = {
    organizeId: '',
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
  }

  cancel() {
    this.query = {
      organizeId: '',
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
    }
    this.load();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }


  load() {
    this.query.organizeId = this.organizeId;
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getHrmPayrollTypePage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.columnDefs = results.data.gridflexs;
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
          label: 'Thông tin chi tiết',
          icon: 'pi pi-tablet',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.deleteRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  editRow(event) {
    this.getInfo(event.rowData.Id)
  }

  getInfo(id = null) {
    const queryParams = queryString.stringify({ Id: id })
    this.apiService.getHrmPayrollTypeInfo(queryParams).subscribe( results => {
      if (results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.listViews = cloneDeep(listViews);
        this.detailInfo = results.data;
      }
    })
  }

  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      accept: () => {
        this.apiService.delHrmPayrollType(event.rowData.Id).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa nhân viên thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  handleSave(event) {
    const params = {
      ...this.detailInfo, group_fields: event
    };
    this.spinner.show();
    this.apiService.setHrmPayrollTypeInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.isEdit = false
          this.load();
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

  quaylai(e){
    this.isEdit = false;
    this.offIsNewPopup.emit(false)
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.columnDefs.filter((d: any) => !d.isHide)),
      {
        headerName: '...',
        filter: '',
        maxWidth: 64,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right cell-action', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        field: 'checkbox'
      }]
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Lương - thuế' },
      { label: 'Loại bảng lương' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        command: () => {
          // this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          // this.exportExel();
        }
      },
    ]
    this.load();
  }


  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  loadjs = 0;
  heightGrid = 300
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['isNew'].currentValue){
      this.isEdit = true;
      this.getInfo()
    }
  }

  hidePoup(event) {
    if(event){
      this.offIsNewPopup.emit(false)
    }
  }

}
