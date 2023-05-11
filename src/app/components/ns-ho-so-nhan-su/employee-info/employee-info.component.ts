import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {

  constructor(
    private apiService: ApiHrmService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  titlePage = '';
  items = [];
  linkUrl = '';
  
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quản lý nhân sự', routerLink: '/nhan-su/ho-so-nhan-su' },
      { label: 'Chi tiết hồ sơ nhân sự' },
      // { label: 'Hồ sơ nhân sự', routerLink: '/nhan-su/ho-so-nhan-su' },
      // { label: `${this.titlePage}` },
    ];
    this.linkUrl = this.activatedRoute.data['_value'].url;
    if (this.linkUrl === 'them-moi-nhan-vien') {
      this.handleParams();
    } else {
      this.handleParams();
    }
    
  }
  paramsObject = null;
  dataRouter = null;
  empId = null;
  handleParams(): void {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.empId = this.paramsObject.params.empId || null;
      this.getEmployeeStatus();
    });
  }
  tabIndex = 0
  handleChange(index) {
    // this.dataEmployeeStatus = null;
    this.tabIndex = index
  }
  dataEmployeeStatus = null;
  getEmployeeStatus() {
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeStatus(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.dataEmployeeStatus = results.data;
        this.handleChange(results.data.tab_st);

      }
    })
  }
  
  reloadEdit() {
    this.dataEmployeeStatus = null;
    this.getEmployeeStatus();
  }

}
