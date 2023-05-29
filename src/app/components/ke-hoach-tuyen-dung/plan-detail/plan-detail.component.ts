import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent implements OnInit {
  @Input() recruitPlantId = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' , icon: "pi pi-send"}
  ]
  @Output() cancelSave = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  listsData = [];
  columnDefs = [];
  gridKey = '';
  files = null
  ngAfterViewInit(): void {
   this.FnEvent();
  }


  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(`${this.gridKey}_kynang`);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addSkill()
        });
      }
    }, 300);
  }

  ngOnInit(): void {
    this.getRecruitPlanDetailPage();
  }
  displaySetting = false;
  CauHinh() {
    this.displaySetting = true;
  }
  addSkill() {
    this.idDetail = null;
    this.getRecruitPlanDetail();
  }
  idDetail = null;
  listViews = [];
  detailInfo = null;
  displayFormEditDetail = false
  getRecruitPlanDetail() {
    const queryParams = queryString.stringify({ recruitPlanId: this.recruitPlantId, id: this.idDetail});
    this.listViews = [];
    this.apiService.getRecruitPlanDetail(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  setRecruitPlanDetail(data) {
    
    const param = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setRecruitPlanDetail(param)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
        this.displayFormEditDetail = false;
        this.getRecruitPlanDetailPage();
        this.FnEvent();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  
  }

  getRecruitPlanDetailPage() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ recruitPlantId: this.recruitPlantId, offSet: 0, pageSize: 10000 });
    this.apiService.getRecruitPlanDetailPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.listsData = repo.data.dataList.data || [];
        this.initGrid(repo.data.gridflexs)
      } else {
        this.spinner.hide();
      }
    })
  }

  cancelDetailInfo(event) {
    if(event === 'CauHinh') {
      this.getRecruitPlanDetail();
    }else {
      this.displayFormEditDetail = false
    }
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs || []),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}_kynang"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        field: 'gridflexdetails1',
        cellClass: ['border-right', 'no-auto'],
        pinned: 'right',
        width: 100,
        cellRenderer: 'buttonAgGridComponent',
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.editRow.bind(this),
                label: 'Xem',
                icon: 'fa fa-edit editing',
                key: 'view-job-detail',
                class: 'btn-primary mr5',
              },

              {
                onClick: this.delRow.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                key: 'delete-qua-trinh-hop-dong',
                class: 'btn-danger',
              },
            ]
          };
        },
      }
    ];
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  editRow({rowData}) {
    this.idDetail = rowData.id
    this.getRecruitPlanDetail();
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({id: event.rowData.id});
        this.apiService.delRecruitPlanDetail(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa thành công' });
            this.getRecruitPlanDetailPage();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  getFilesDetail(event) {
    this.files = event;
  }

}
