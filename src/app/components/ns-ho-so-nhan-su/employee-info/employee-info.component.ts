import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
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
  linkUrl = ''
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quản lý nhân sự', routerLink: '/nhan-su/ho-so-nhan-su' },
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
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.empId = this.paramsObject.params.empId || null;
      this.getMenuInfo();
    });
  }
  tabIndex = 0
  handleChange(index) {
    this.tabIndex = index
  }

  getMenuInfo() {
    this.spinner.show();
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmployeeData('GetEmployeeByPersonal', queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.handleChange(results.data.flow_st);
      }
    })
  }


}
