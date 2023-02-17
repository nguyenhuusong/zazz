import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-cong-ty-orgid',
  templateUrl: './cong-ty.component.html',
  styleUrls: ['./cong-ty.component.scss']
})
export class CongTyComponent implements OnInit {
  @Input() orgId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  listsData = [];
  columnDefs = [];
  gridKey = '';

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_worked`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addCompany()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getOrgCompanyPage();
  }

  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  displayFormEditDetail = false;
  addCompany() {
    this.displayFormEditDetail = true;

  }
  listSources = [];
  listTargets = [];
  listCompanies = [];
  selectedCompanies = [];
  getCompanyList() {
    this.listSources = [];
    this.listTargets = [];
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getCompanies(queryParams).subscribe(results => {
      if (results.status === 'success') {
          this.listCompanies = results.data;
          if(this.listsData.length === 0) {
            this.listSources = cloneDeep(this.listCompanies);
            this.listTargets = []
          }else {
            for(let item of this.listCompanies) {
              if(this.listsData.map(d => d.companyId).indexOf(item.value) > -1) { 
                this.listTargets.push(item)
              }else {
                this.listSources.push(item)
              }
            }
            this.listTargets= [...this.listTargets]
            this.listSources= [...this.listSources]
          }

      } 
    })
  }

  getOrgCompanyPage() {
    this.listTargets= []
    this.listSources= []
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ orgId: this.orgId, offSet: 0, pageSize: 10000 });
    this.apiService.getOrgCompanyPage(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
        this.getCompanyList();
      } else {
        this.spinner.hide();
      }
    })
  }



  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_worked"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 70,
        cellRenderer: '',
        cellRendererParams: params => {
          return {
            buttons: [
              // {
              //   onClick: this.editRow.bind(this),
              //   label: 'Xem chi tiết',
              //   icon: 'fa fa-edit editing',
              //   key: 'view-job-detail',
              //   class: 'btn-primary mr5',
              // },

              // {
              //   onClick: this.delRow.bind(this),
              //   label: 'Xóa',
              //   icon: 'pi pi-trash',
              //   key: 'delete-qua-trinh-hop-dong',
              //   class: 'btn-danger',
              // },
            ]
          };
        },
      }
    ];
  }

  editRow({rowData}) {
  
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  xacnhan() {
      if(this.listTargets.length > 0) {
        const params = {
          orgDepId: this.orgId,
          companyIds: this.listTargets.map(d => d.value)
        }
        this.spinner.show();
        this.apiService.setOrgCompany(params).subscribe(results => {
            if(results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : results.message });
              this.getOrgCompanyPage();
              this.spinner.hide();
              this.displayFormEditDetail = false;
            }else {
              this.spinner.hide();
            }
        })
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn bản ghi nào !. Vui long chọn 1 bản ghi' });
      }
    
  }

}
