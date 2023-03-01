import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HideFullScreen, ShowFullScreen } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-import-tuyen-dung',
  templateUrl: './import-tuyen-dung.component.html',
  styleUrls: ['./import-tuyen-dung.component.scss']
})
export class ImportTuyenDungComponent implements OnInit {
  items: any = [];
  isFullScreen = false;
  heightGrid = 0
  isShowUpload = true;
  listsData: Array<any> = []
  columnDefs: Array<any> = [];
  cols: any[];
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
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách tuyển dụng', routerLink: '/tuyen-dung/ds-tuyen-dung' },
      { label: 'Import tuyển dụng' },
    ];
  }
  
  toggleGrid() {
    this.isFullScreen = !this.isFullScreen;
    if(this.isFullScreen) {
      this.heightGrid = ShowFullScreen()
    }else {
      this.heightGrid = HideFullScreen()
    }
  }

  onSelectFile(event) {
    if (event.currentFiles.length > 0) {
      this.spinner.show();
      this.isShowUpload = false;
      let fomrData = new FormData();
      fomrData.append('formFile', event.currentFiles[0]);
      this.apiService.importCandidates(fomrData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          if(results.data && results.data.dataList && results.data.dataList.data) {
            this.cols = results.data.gridflexs;
            this.initGrid();
            const a: any = document.querySelector(".header");
            const b: any = document.querySelector(".sidebarBody");
            const c: any = document.querySelector(".bread-filter");
            // const d: any = document.querySelector(".filterInput");
            const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + 80;
            this.heightGrid = window.innerHeight - totalHeight
            this.changeDetector.detectChanges();
            // this.onInitAgGrid();
            this.listsData = results.data.dataList.data;
          }
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
        }else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          this.spinner.hide();
        }
      })
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
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung']);
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
    this.listsData  = [];
    this.columnDefs = [];
  }

  getTemfileImport() {
    this.apiService.exportReportLocalhost('assets/tpl-import-file/file_mau_import_tuyen_dung.xlsx')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: any) => {
      this.createImageFromBlob(data)
    });
  }

  createImageFromBlob(image: Blob) {
    var blob = new Blob([image]);
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "file_mau_import_tuyen_dung.xlsx";
    anchor.href = url;
    anchor.click();
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit()
  }


}
