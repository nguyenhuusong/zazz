import { Component, OnInit } from '@angular/core';
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
    private messageService: MessageService) {
  }
  
  query = {
    report_type: -1
  };
  reports = [];
  listReports = [];
  chiTietThamSoBaoCao = null;
  items = []
  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
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
            label: `${d.report_group} [${d.report_name}]`,
            value: d.report_id,
            api: d.api_url
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
            }
          });
        }

        this.spinner.hide();
      },
      error => { });
  }

  getCompanyList(element1: any): void {
    const queryParams = queryString.stringify({ org_id: 0 });
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
    const name = this.listReports.find(t => t.value === this.query.report_type).label;
    const api = this.listReports.find(t => t.value === this.query.report_type).api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(api, queryParams)
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
    const name = this.listReports.find(t => t.value === this.query.report_type).label;
    const api = this.listReports.find(t => t.value === this.query.report_type).api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(api, queryParams)
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
    const name = this.listReports.find(t => t.value === this.query.report_type).label;
    const api = this.listReports.find(t => t.value === this.query.report_type).api;
    if (api) {
      const queryParams = queryString.stringify(params);
      this.apiService.get(api, queryParams)
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
      }
    });
    return params;
  }
}




