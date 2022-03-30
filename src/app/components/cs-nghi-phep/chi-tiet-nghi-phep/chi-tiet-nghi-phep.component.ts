import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-nghi-phep',
  templateUrl: './chi-tiet-nghi-phep.component.html',
  styleUrls: ['./chi-tiet-nghi-phep.component.scss']
})
export class ChiTietNghiPhepComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  }
  ]
  url: string = '';
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
      { label: 'Chính sách' },
      { label: 'Danh sách nghỉ phép', routerLink: '/chinh-sach/nghi-phep' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  id = null
  titlePage = ''
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.id = this.paramsObject.params.id;
        this.getLeaveInfo();
      });
  };

  getLeaveInfo() {
    const queryParams = queryString.stringify({ id: this.id });
    this.apiService.getLeaveInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }
  setLeaveInfo(data) {
      const params = {
        ...this.detailInfo, group_fields: data
      }
      this.apiService.setLeaveInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
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
  // setCandidateInfo(data) {
  //   this.spinner.show();
  //   const params = {
  //     ...this.detailInfo, group_fields: data
  //   }
  //   this.apiService.setCandidateInfo(params)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((results: any) => {
  //       if (results.status === 'success') {
  //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
  //         this.spinner.hide();
  //       } else {
  //         this.messageService.add({
  //           severity: 'error', summary: 'Thông báo',
  //           detail: results.message
  //         });
  //         this.spinner.hide();
  //       }
  //     }), error => {
  //       this.spinner.hide();
  //     };
  // }

  quaylai(data) {
    this.router.navigate(['/chinh-sach/nghi-phep']);

  }

}


