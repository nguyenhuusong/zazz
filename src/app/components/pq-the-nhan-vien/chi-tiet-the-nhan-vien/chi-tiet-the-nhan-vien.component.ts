import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-the-nhan-vien',
  templateUrl: './chi-tiet-the-nhan-vien.component.html',
  styleUrls: ['./chi-tiet-the-nhan-vien.component.scss']
})
export class ChiTietTheNhanVienComponent implements OnInit, OnDestroy {
  @Input() empId = '';
  @Input() canId = '';
  @Output() callback = new EventEmitter<any>();
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Phân quyền'},
      { label: 'Danh sách thẻ nhân viên', routerLink: '/phan-quyen/the-nhan-vien' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  modelEdit = {
    carCode: null,
    empId: null
  }
  titlePage = '';
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.carCode = this.canId || null
        this.modelEdit.empId = this.empId || null
        this.GetEmployeeCardInfo();
      });
  };

  GetEmployeeCardInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getEmployeeCardInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = [...results.data.group_fields];
          this.detailInfo = results.data;
          // this.listViews.forEach( group => {
          //   group.fields.forEach(field => {
          //     if(field.field_name === 'CustId') { 
          //       field.columnValue = this.modelEdit.empId;
          //     }
          //   });
          // })
          // this.listViews = [...this.listViews];
        }
      });
  }

  SetEmployeeCardInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setEmployeeCardInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.callback.emit();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.GetEmployeeCardInfo();
    }else {
      this.callback.emit();
    }
  }

}


