import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import * as FileSaver from 'file-saver';
import { AgGridFn, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-thong-tin-ca-nhan',
  templateUrl: './thong-tin-ca-nhan.component.html',
  styleUrls: ['./thong-tin-ca-nhan.component.scss']
})
export class ThongTinCaNhanComponent implements OnInit {
  detailInfo = null;
  @Input() empId = null;
  @Input() dataEmployeeStatus = null;
  @Output() reloadEdit = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmployeeInfo();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
   
  }

  optionsButtonsView = [
  ]
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  status = [];
  selectedStatus = null;
  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpProfile(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        // if (!this.codeStaff) { // không hiểu làm gì (manh)
        //   this.codeStaff = getFieldValueAggrid(results.data, 'code');
        // }
        this.status = results.data.flowStatuses;
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        if(this.detailInfo.actions && this.detailInfo.actions.length > 0) {
          this.initButton();
        }
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
  }

  recruiUpdateStatus() {

  }
  
  callActions(e) {
    
  }

  optionsButon = [];
  menuActions = [];
  initButton() {
    // this.optionsButon = this.detailInfo.actions.map(item => {
    //   return {
    //     label: item.name,
    //     value: item.code,
    //     icon: item.icon
    //   }
    // });

    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this[item.code]();
        }
      }
    });
  }

  displayuploadcontract = false;
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  setEmployeeInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.apiService.setEmpProfile(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
      
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  cancelUpdate(button) {
     if (button === 'CauHinh') {
      this.getEmployeeInfo();
    } else if (button === 'xuatHoSo') {
      // this.exportResume();
    }
  }

  actExport() {
    this.spinner.show();
    this.apiService.exportResume(queryString.stringify({ empId: this.detailInfo.empId }))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else if (results.type === 'application/octet-stream') {
        var blob = new Blob([results], { type: 'application/msword' });
        FileSaver.saveAs(blob, `Thông tin hồ sơ cá nhân` + ".docx");
        this.spinner.hide();
      }
    })
  }

  onBack() {
    this.router.navigate(['/nhan-su/ho-so-nhan-su'])
  }

  // dùng cho các phần Giấy tờ tùy thân, Thông tin hồ sơ cá nhân, Danh sách đính kèm, Danh sách thông tin người liên hệ
  // @listViewsPart
 

  isEditDetail = false;
  actViewEdit(code) {
    this.isEditDetail = true;
  }

  cancelSetDetail(event) {
    this.isEditDetail = false;
    this.getEmployeeInfo();
  }

  theFileChanged(event) {
    if(event === 'dataSubmited') {
      this.getEmployeeInfo();
    }
  }


}

