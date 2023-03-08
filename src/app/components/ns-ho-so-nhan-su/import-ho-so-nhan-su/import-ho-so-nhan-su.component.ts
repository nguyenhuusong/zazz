import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HideFullScreen, ShowFullScreen } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as queryString from 'querystring';
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
  selector: 'app-import-ho-so-nhan-su',
  templateUrl: './import-ho-so-nhan-su.component.html',
  styleUrls: ['./import-ho-so-nhan-su.component.scss']
})
export class ImportHoSoNhanSuComponent implements OnInit {
  items: any = [];
  isFullScreen = false;
  heightGrid = 0
  isShowUpload = true;
  listsData: Array<any> = []
  columnDefs: Array<any> = [];
  cols: any[];
  dataImport: DataImport = null;
  gridApi: any = null
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
      { label: 'Danh sách hồ sơ nhân sự', routerLink: '/nhan-su/ho-so-nhan-su' },
      { label: 'Import hồ sơ nhân sự' },
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
  isImport = false;
  dataImported = []
  onSelectFile(event) {
    this.isImport = false;
    if (event.currentFiles.length > 0) {
      this.spinner.show();
      this.isShowUpload = false;
      let fomrData = new FormData();
      fomrData.append('file', event.currentFiles[0]);
      this.apiService.employeeImport(fomrData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.dataSet(results);
      })
    }
  }

  checkData(accept = false) {
    this.spinner.show();
    this.isShowUpload = false;
    const params = {
      accept: accept,
      imports: this.listsData
    }
    this.apiService.setEmployeeAccept(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.dataSet(results)
      })
  }

  gridKey = '';
  displaySetting = false;
  cauhinh() {
    this.displaySetting = true;
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
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + 80;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
        this.listsData = results.data.dataList;
        if(!results.data.valid) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.data.messages });
        }
      }
      this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      this.spinner.hide();

      this.isImport = true;
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
    this.router.navigate(['/nhan-su/ho-so-nhan-su']);
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
    this.isImport = false
    this.isShowUpload = true;
    this.listsData  = [];
    this.columnDefs = [];
    this.dataImport = null;
  }

  getTemfileImport() {
    this.apiService.getEmployeeImportTemp()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else {
        var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `file_mau_ho_so_nhan_su` +".xlsx");
        this.spinner.hide();
      }
    })
  }

  createImageFromBlob(image: Blob) {
    var blob = new Blob([image]);
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "HoSoNhanSu_Import.xlsx";
    anchor.href = url;
    anchor.click();
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    let rowData = [];
    if(this.gridApi) {
      this.gridApi.forEachNode(node => rowData.push(node.data));
    }
    this.dataImported = rowData;
  }

  exportDraft() {
    this.spinner.show();
    const query = {
      accept: true,
      imports: this.dataImported
    }
    this.apiService.setEmployeeExportDraft(query)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {

        if (results.type === 'application/json') {
          this.spinner.hide();
        } else if (results.type === 'application/octet-stream') {
          var blob = new Blob([results], { type: 'application/msword' });
          FileSaver.saveAs(blob, `Danh sách nhân sự đã import` + ".xlsx");
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      });
  }

}
