import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService) {
  }
  
  query = {
    report_type: -1
  };
  reports = [];
  listReports = [];
  chiTietThamSoBaoCao = null;
  items = [];

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Báo cáo' },
    ];
    this.load();
  }

  load(): void {
    this.spinner.show();
    const queryParams = queryString.stringify({ report_type: -1 });
    this.apiService.getReportList(queryParams).subscribe(
      (results: any) => {
        this.reports = results.data;
        this.listReports = results.data.map(d => {
          return {
            label: `${d.report_group} - ${d.report_name}`,
            value: d.report_id,
            api: d.api_url,
          };
       
        });
        if (this.listReports.length > 0) {
          this.query.report_type = this.listReports[0].value;
          this.chiTietThamSoBaoCao = this.reports[0];
          this.chiTietThamSoBaoCao.paramaters.forEach(element => {
            if (element.param_type === 'datetime') {
              element[element.param_cd] = new Date();
            } else if (element.param_type === 'object') {
              if (element.param_cd === 'companyId') {
                this.getCompanyList(element);
              }
              if (element.param_cd === 'typeBM') {
                this.getObjectList(element);
              }
            }else if (element.param_type === 'multiSelect') {
              if (element.param_cd === 'organizeId') {
                this.getOrganizeParam(element);
              }
            }
          });
        }

        this.spinner.hide();
      },
      error => { });
  }

  getDetailReport(event) {
    let items = this.reports.filter(d => d.report_id === this.query.report_type)
    this.chiTietThamSoBaoCao = items[0];
    // if(this.chiTietThamSoBaoCao.report_id == 7) {
    //   this.chiTietThamSoBaoCao.paramaters[1] = {...this.chiTietThamSoBaoCao.paramaters[1], param_type: 'multiSelect'};
    //   this.chiTietThamSoBaoCao.paramaters[2] = {...this.chiTietThamSoBaoCao.paramaters[2], param_type: 'multiSelect'};
    //   this.chiTietThamSoBaoCao.paramaters = [...this.chiTietThamSoBaoCao.paramaters];
    // }
    this.chiTietThamSoBaoCao.paramaters.forEach(element => {
      if (element.param_type === 'datetime') {
        element[element.param_cd] = new Date();
      } else if (element.param_type === 'object') {
        if (element.param_cd === 'companyId') {
          this.getCompanyList(element);
        }
        if (element.param_cd === 'typeBM') {
          this.getObjectList(element);
        }
      }else if (element.param_type === 'multiSelect') {
        if (element.param_cd === 'organizeId') {
          this.getOrganizeParam(element);
        }
      }
    });
   
  }

  getCompanyList(element1: any): void {
    const queryParams = queryString.stringify({ orgId: 0 });
    this.apiService.getCompanyList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(res => {
          return {
            label: `${res.companyName}`,
            value: `${res.companyId}`
          };
        });
        element1[element1.param_cd] = element1.param_default;
      }
    });
  }

  getOrganizeParam(element1: any): void {
    const queryParams = queryString.stringify({ filter:'' });
    this.apiService.getOrganizeParam(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(res => {
          return {
            name: `${res.organizationName}`,
            code: `${res.organizeId}`
          };
        });
        element1[element1.param_cd] = element1.param_default;
      }
    });
  }

  selectChangeMultiSelect(event, name) {
    if(name === 'organizeId') {
        this.getDepartmentParams(event.value.filter(d => d != 1));
    }else if(name === 'departmentId') {
    }

  }

  getDepartmentParams(organizeId: any[]): void {
    console.log(organizeId.map(d => d.code))
    const queryParams = queryString.stringify({ organizeId: organizeId.map(d => d.code).toString() });
    this.apiService.getDepartmentParams(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.setValue(results.data,'departmentId')
      }
    });
  }

  setValue(values, field_name) {
    this.chiTietThamSoBaoCao.paramaters.forEach(element => {
      if(element.param_cd === field_name) {
        element.options = values.map(res => {
          return {
            name: `${res.departmentName}`,
            code: `${res.departmentId}`
          };
        });
        element[element.param_cd] = element.param_default;
      }
    });
  }

  getObjectList(element1: any): void {
    const queryParams = queryString.stringify({ objKey: 'object_bm_st' });
    this.apiService.getCustObjectListNew(false,queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(res => {
          return {
            label: `${res.objName}`,
            value: `${res.objValue}`
          };
        });
        element1[element1.param_cd] = element1.param_default;
      }
    });
  }

  ViewExcel(type): void {
    this.spinner.show();
    const params = this.getParams(type);
    const name = this.listReports.filter(t => t.value === this.query.report_type)[0].label;
    const api = this.listReports.filter(t => t.value === this.query.report_type)[0].api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(window.location.host + api, queryParams)
      .subscribe(response => {
        if (response.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, name + ".xlsx");
          this.spinner.hide();
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xuất báo cáo bị lỗi' });
      });
    }
  }

  exportExcel(type): void {
    this.spinner.show();
    const params = this.getParams(type);
    const name = this.listReports.filter(t => t.value === this.query.report_type)[0].label;
    const api = this.listReports.filter(t => t.value === this.query.report_type)[0].api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(window.location.host + api, queryParams)
      .subscribe(response => {
        if (response.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, name + ".xlsx");
          this.spinner.hide();
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xuất báo cáo bị lỗi' });
      });
    }
  }

  exportPdf(type): void {
    this.spinner.show();
    const params = this.getParams(type);
    const name = this.listReports.filter(t => t.value === this.query.report_type)[0].label;
    const api = this.listReports.filter(t => t.value === this.query.report_type)[0].api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(window.location.host + api, queryParams)
      .subscribe(response => {
        if (response.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([response], { type: 'application/pdf;charset=utf-8' });
          FileSaver.saveAs(blob, name + ".pdf");
          this.spinner.hide();
        }
       
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Xuất báo cáo bị lỗi' });
      });
    }
  }

  getParams(type): any {
    const params: any = {};
    params.type = type;
    this.chiTietThamSoBaoCao.paramaters.forEach(element => {
      if (element.param_type === 'datetime') {
        params[element.param_cd] = element[element.param_cd] ? moment(new Date(element[element.param_cd])).format('DD/MM/YYYY') : null;
      } else if (element.param_type === 'object') {
        params[element.param_cd] = element[element.param_cd];
      }else if (element.param_type === 'multiSelect') {
        console.log(element[element.param_cd] && (element[element.param_cd] != 1) && (element[element.param_cd].length > 0))
        if( element[element.param_cd] && (element[element.param_cd] != 1) && (element[element.param_cd].length > 0)) {
          const param_cds = element[element.param_cd].filter(d => d != 1);
          if(element.param_cd === 'departmentId') {
            params[element.param_cd] = param_cds.map(d => d.code).toString();
          }else {
            params[element.param_cd] = param_cds.map(d => d.code).toString();
          }
        }
        
      }
    });
    return params;
  }
}




