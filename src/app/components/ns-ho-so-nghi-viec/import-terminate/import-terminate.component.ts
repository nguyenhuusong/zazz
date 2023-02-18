import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HideFullScreen, ShowFullScreen } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as FileSaver from 'file-saver';
interface DataImport {
  valid: boolean,
  messages: string,
  accept: boolean,
  recordsTotal: number,
  recordsFail: number,
  recordsAccepted: number,
  gridKey: string,

}
@Component({
  selector: 'app-import-terminate',
  templateUrl: './import-terminate.component.html',
  styleUrls: ['./import-terminate.component.scss']
})
export class ImportTerminateComponent implements OnInit {
  items: any = [];
  isFullScreen = false;
  heightGrid = 0
  isShowUpload = true;
  listsData: Array<any> = []
  columnDefs: Array<any> = [];
  cols: any[];
  dataImport: DataImport = null
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
  ) { }

  private readonly unsubscribe$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Danh sách hồ sơ nhân sự nghỉ việc', routerLink: '/nhan-su/ho-so-nghi-viec' },
      { label: 'Import hồ sơ nhân sự nghỉ việc' },
    ];
  }

  toggleGrid() {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      this.heightGrid = ShowFullScreen()
    } else {
      this.heightGrid = HideFullScreen()
    }
  }

  onSelectFile(event) {
    this.isImport = false;
    if (event.currentFiles.length > 0) {
      this.spinner.show();
      this.isShowUpload = false;
      let fomrData = new FormData();
      fomrData.append('file', event.currentFiles[0]);
      this.apiService.setTerminateImport(fomrData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          this.dataSet(results)
        })
    }
  }
  gridKey = '';
  displaySetting = false;
  cauhinh() {
    this.displaySetting = true;
  }

  checkData(accept = false) {
    this.spinner.show();
    this.isShowUpload = false;
    const params = {
      accept: accept,
      imports: this.listsData
    }
    this.apiService.setTerminateAccept(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.dataSet(results)
      })
  }

  
  dataSet(results) {
    if (results.status === 'success') {
      this.dataImport = results.data;
      if (results.data && results.data.dataList && results.data.dataList) {
        this.cols = results.data.gridflexs.map(item => {
          return {
            ...item,
            editable: true
          }
        });
        this.gridKey = results.data.gridKey;
        this.initGrid();
        const a: any = document.querySelector(".header");
        const b: any = document.querySelector(".sidebarBody");
        const c: any = document.querySelector(".bread-filter");
        // const d: any = document.querySelector(".filterInput");
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + 80;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
        this.isImport = true;
        // this.onInitAgGrid();
        this.listsData = results.data.dataList;
        if(!results.data.valid) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.data.messages });
        }
      }
      this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      this.spinner.hide();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      this.spinner.hide();
    }
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide))
    ]
  }

  back() {
    const main: any = document.querySelector(".main");
    main.className = 'main';
    this.router.navigate(['/nhan-su/ho-so-nghi-viec']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getContextMenuItems(params) {
    var result = [
      'copy',
      'paste',
      'separator',
      'excelExport'
    ];
    return result;
  }

  refetchFile() {
    this.isShowUpload = true;
    this.listsData = [];
    this.columnDefs = [];
  }

  getTemfileImport() {
    this.apiService.exportReportLocalhost('assets/tpl-import-file/Import_HSNS_NghiViec.xlsx').subscribe((data: any) => {
      this.createImageFromBlob(data)
    });
  }

  createImageFromBlob(image: Blob) {
    var blob = new Blob([image]);
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "Import_HSNS_NghiViec.xlsx";
    anchor.href = url;
    anchor.click();
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit()
  }
  isImport = false;
  exportDraft() {
    this.spinner.show();
    const query = {
      accept: true,
      imports: this.listsData
    }
    this.apiService.setTerminateExportDraft(query).subscribe(
      (results: any) => {

        if (results.type === 'application/json') {
          this.spinner.hide();
        } else if (results.type === 'application/octet-stream') {
          var blob = new Blob([results], { type: 'application/msword' });
          FileSaver.saveAs(blob, `Danh sách hồ sơ nghỉ việc import` + ".xlsx");
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      });
  }


}
