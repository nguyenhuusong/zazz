import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-chuyen-mon-orgid',
  templateUrl: './chuyen-mon.component.html',
  styleUrls: ['./chuyen-mon.component.scss']
})
export class ChuyenMonComponent implements OnInit {
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.getOrgJobPage();
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
  listJobs = [];
  selectedJobs = [];
  getJobTitles() {
    this.apiService.getJobTitles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
          this.listJobs = results.data;
          if(this.listsData.length === 0) {
            this.listSources = cloneDeep(this.listJobs);
            this.listTargets = []
          }else {
            for(let item of this.listJobs) {
              if(this.listsData.map(d => d.jobId).indexOf(item.value) > -1) { 
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

  getOrgJobPage() {
    this.listTargets= [];
    this.listSources= [];
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ orgId: this.orgId, offSet: 0, pageSize: 10000 });
    this.apiService.getOrgJobPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs);
        this.FnEvent();
        this.getJobTitles();
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
          jobIds: this.listTargets.map(d => d.value)
        }
        this.spinner.show();
        this.apiService.setOrgJob(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if(results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : results.message });
              this.getOrgJobPage();
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
