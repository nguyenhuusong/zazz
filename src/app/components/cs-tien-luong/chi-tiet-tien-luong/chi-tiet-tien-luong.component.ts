
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, TextFormatter } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-tien-luong',
  templateUrl: './chi-tiet-tien-luong.component.html',
  styleUrls: ['./chi-tiet-tien-luong.component.scss']
})
export class ChiTietTienLuongComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  recordId = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage : string = '';
  url: string = '';
  items = [];
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {
 
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách tiền lương', routerLink: '/chinh-sach/tien-luong' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.recordId = this.paramsObject.params.recordId || null;
      if(this.url === 'them-moi-tien-luong') {
        this.setSalaryCreateDraft()
      }else {
        this.getSalaryRecordInfo();
      }
    
    });
  };

  setSalaryCreateDraft() {
    this.apiService.setSalaryCreateDraft(this.paramsObject.params).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.monthdays);
        this.columnDefs = [...AgGridFn(this.detailInfo.gridflexs1 || [])
       
      ];
      }
    })
  }
  detailInfo = null;
  listsData = []
  columnDefs
  getSalaryRecordInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({recordId: this.recordId});
    this.apiService.getSalaryRecordInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.monthdays);
        this.listDataNew =this.listsData;
        this.columnDefs = [...this.agGridFnCustomer(this.detailInfo.gridflexs1 || [])
        // , {
        //   headerName: '',
        //   field: 'button',
        //   filter: '',
        //   pinned: 'right',
        //   width: 60,
        //   cellRenderer: 'buttonRendererMutiComponent',
        //   cellClass: ['border-right'],
        //   // cellRendererParams: params => this.showButton()
        // }
      ];
      }
    })
  }

  OnClick(e) {

  }
  listDataNew = [];
  handleChange(index) {
    this.columnDefs = []
    this.indexTab = index;
    if(this.indexTab === 1) {
      this.getSalaryEmployeePage()
    }else {
      this.listsData = cloneDeep(this.detailInfo.monthdays);
      this.listDataNew =this.listsData;
      this.columnDefs = [...this.agGridFnCustomer(this.detailInfo.gridflexs1 || [])]
    }
  }

  getSalaryEmployeePage() {
    this.spinner.show();
    const queryParams = queryString.stringify({recordId: this.recordId});
    this.apiService.getSalaryEmployeePage(queryParams).subscribe(results => {
      if(results.status === 'success') {
        this.listsData =results.data.dataList.data;
        this.columnDefs = [
          ...AgGridFn(results.data.gridflexs),
        ]
        this.spinner.hide()
      }else {
        this.spinner.hide()
      }
    })
  }

  setSalaryRecordInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setSalaryRecordInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if(this.url === 'them-moi-tien-luong') {
          this.goBack()
        }else {
          this.manhinh = 'Edit';
          this.getSalaryRecordInfo();
        }
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }


  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
   if(this.titlePage) {
    this.router.navigate(['/chinh-sach/tien-luong']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate() {
    this.manhinh = 'Edit';
    this.getSalaryRecordInfo();
  }
  

  cellRendererSanPham =(params) => {
    console.log(params)
    let rowData = [];
    if (!params.value || params.value === '(Select All)') {
      return params.value;
    }
    setTimeout(() => {
      params.api.forEachNodeAfterFilter(node => {
        console.log(node.data);
        rowData.push(node.data)
      } );
      this.listDataNew =  rowData
    }, 500);
    return params.value;
  }

  agGridFnCustomer(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
     let row = {
        headerName: value.columnCaption,
        field: value.columnField,
        cellClass: value.cellClass,
        filter: value.isFilter ? 'agSetColumnFilter' : '',
        sortable: false,
        filterParams: {
          caseSensitive: true,
          textFormatter:  (r) => TextFormatter(r),
          cellRenderer:  this.cellRendererSanPham,
        },
        cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
        hide: value.isHide ? true : false,
        pinned: value.pinned,
        tooltipField: value.columnField,
        headerTooltip: value.columnCaption
        // valueFormatter: value.fieldType == 'decimal' ? ""
    }
        arrAgGrids.push(row);
    }
    return arrAgGrids
}
}



