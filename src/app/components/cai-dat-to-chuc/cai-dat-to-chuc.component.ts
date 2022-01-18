import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-cai-dat-to-chuc',
  templateUrl: './cai-dat-to-chuc.component.html',
  styleUrls: ['./cai-dat-to-chuc.component.scss']
})
export class CaiDatToChucComponent implements OnInit {
  pagingComponent = {
    total: 0
  };
  projects = []
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  dataEmployee = null
  capaStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Chưa duyệt', value: 0 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 2 },
    { label: 'Khởi tạo', value: null },
  ]
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  menuItem = []
  organizeLevelList = []
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 50;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,

    };
  }
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15,
    org_id: 0,
    isLock: -1,
    isApprove: -1,
    org_level: 0,
  }

  titleForm = {
    label: 'Thêm mới phòng ban',
    value: 'Add'
  }
  displayOrganize = false;
  selectedNode
  listAgencyMap: TreeNode[];
  displayButton = false;
  detailOrganizeMap = null;
  modeAgencyOrganize = {
    org_id: 0,
    org_cd: '',
    org_name: '',
    org_level: 0,
    parent_id: 0,
    org_type: '',
    isChild: false,
    de_cd: null
  }
  departments = [];
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      org_id: 0,
      isLock: -1,
      isApprove: -1,
      org_level: 0
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAgencyOrganizeMap() {
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          this.detailOrganizeMap = this.selectedNode
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          this.query.org_id = this.selectedNode.org_id;
          this.query.org_level = this.selectedNode.org_level;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          this.query.org_id = this.selectedNode.org_id;
          console.log(this.selectedNode.parent_id)
          this.parseObjectProperties(this.listAgencyMap, this.selectedNode.parent_id);
          this.detailOrganizeMap = this.selectedNode
          this.selected(this.listAgencyMap, this.query.org_id);
          this.query.org_level = this.selectedNode.org_level;
          this.load();
        }
      }
    })
  }

  addPosition() {
    const params = {
      org_level: this.detailOrganizeMap.org_level
    }
    this.router.navigate(['/cai-dat/chuc-vu'], { queryParams: params });
  }


  parseObjectProperties(obj, org_id = 0) {
    for (let k of obj) {
      if (k.org_id === org_id) {

        k.expanded = true;
      } else {
        if (k.hasOwnProperty('children') && Array.isArray(k.children) && k.children.length > 0) {
          this.parseObjectProperties(k.children, org_id);
        }
      }
    }
  }



  // expanded(datas = [], org_id = 0) {
  //   datas.forEach(d => {
  //     if (d.org_id === org_id) {
  //       d.expanded = true;
  //     } else {
  //       if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parent_id)
  //     }
  //   })
  //   return datas
  // }

  selected(datas = [], org_id = 0) {
    datas.forEach(d => {
      if (d.org_id === org_id) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.org_id)
      }
    }
    )
  }

  getOrganizeLevelList() {
    this.apiService.getOrganizeLevelList().subscribe(results => {
      if (results.status === 'success') {
        this.organizeLevelList = results.data.map(d => {
          return {
            label: d.org_level_name,
            value: d.org_level
          }
        });
      }
    })
  }


  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getOrganizePage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.thongtinphongban.bind(this),
          label: 'Thông tin tổ chức',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
        },

      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
    this.detailCellRendererParams = {
      detailGridOptions: {
        frameworkComponents: {},
        getRowHeight: (params) => {
          return 40;
        },
        columnDefs: [
          ...AgGridFn(this.colsDetail),
        ],

        enableCellTextSelection: true,
        onFirstDataRendered(params) {
          let allColumnIds: any = [];
          params.columnApi.getAllColumns()
            .forEach((column: any) => {
              if (column.colDef.cellClass.indexOf('auto') < 0) {
                allColumnIds.push(column)
              } else {
                column.colDef.suppressSizeToFit = true;
                allColumnIds.push(column)
              }
            });
          params.api.sizeColumnsToFit(allColumnIds);
        },
      },
      getDetailRowData(params) {
        params.successCallback(params.data.AgencyGenerals);
      },
      excelStyles: [
        {
          id: 'stringType',
          dataType: 'string'
        }
      ],
      template: function (params) {
        var personName = params.data.theme;
        return (
          '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
          `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.AgencyGenerals.length}) : [` +
          personName + ']' +
          '</div>' +
          '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
          '</div>'
        );
      },
    };
  }

  thongtinphongban(event) {
    const params = {
      org_id: event.rowData.org_id
    }
    this.router.navigate(['/cai-dat/cai-dat-to-chuc/chi-tiet-to-chuc'], { queryParams: params })
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }

  getAgencyOrganizeList(org_level) {
    const queryParams = queryString.stringify({ org_level: org_level });
    this.apiService.getOrganizeList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organizeList = results.data;
        this.organizeList = this.organizeList.map(d => {
          return {
            label: d.org_name,
            value: d.org_id
          }
        })
      }
    })
  }

  selectDepartment(event) {
    const items = this.departments.filter(d => d.value === this.modeAgencyOrganize.de_cd);
    this.modeAgencyOrganize.org_cd = items[0].value
    this.modeAgencyOrganize.org_name = items[0].label
  }

  getDepartments(parent_id) {
    const queryParams = queryString.stringify({ parent_id: parent_id })
    this.apiService.organizeGetDepartments(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.departments = results.data.map(d => {
          return {
            label: d.departmentName,
            value: d.departmentCd
          }
        });
      }
    })

  }
  url = '';
  dataRouter = null;
  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', url: '/cai-dat/cai-dat-to-chuc' },
      { label: 'Danh sách chức vụ' },
    ];
    this.menuItem = [
      {
        label: 'Chức vụ',
        icon: 'pi pi-refresh',
        command: () => {
          this.addPosition();
        }
      },
      {
        label: 'Nơi làm việc',
        icon: 'pi pi-refresh',
        command: () => {
          this.AddWorkplace();
        }
      },
      {
        label: 'Cài đặt tham số',
        icon: 'pi pi-refresh',
        command: () => {
          if (this.detailOrganizeMap.org_level === 1) {
            const params = {
              org_cd: this.detailOrganizeMap.org_cd
            }
            this.router.navigate(['/cai-dat/cai-dat-tham-so'], { queryParams: params });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chọn tổ chức level 1' });
          }

        }
      },
      {
        label: 'Lịch làm việc',
        icon: 'pi pi-calendar',
        command: () => {
          this.workTime();
        }
      },
    ]
    this.getAgencyOrganizeMap();
    this.getOrganizeLevelList();
    // this.getRegionList();
    // this.getAgencyOrganizeTypes();
  }

  workTime() {
    this.router.navigate(['/cai-dat/lich-lam-viec']);
  }

  AddWorkplace() {
    this.router.navigate(['/cai-dat/noi-lam-viec']);
  }

  organizeList = []
  onNodeSelect(event) {
    this.detailOrganizeMap = event.node;
    this.getlistnv();
    // this.displayButton = true;
  }

  getlistnv() {
    localStorage.setItem("organize", JSON.stringify(this.detailOrganizeMap))
    this.query.org_id = this.detailOrganizeMap.org_id;
    this.load();
    this.displayButton = false;
  }

  Add() {
    this.getDepartments(this.detailOrganizeMap.org_id);
    this.titleForm = {
      label: 'Thêm mới phòng ban',
      value: 'Add'
    }
    const queryParams = queryString.stringify({ org_level: this.detailOrganizeMap.org_level });
    this.apiService.getOrganizeList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organizeList = results.data;
        this.organizeList = this.organizeList.map(d => {
          return {
            label: d.org_name,
            value: d.org_id
          }
        })

        this.displayOrganize = true;
        if (this.detailOrganizeMap.parent_id > 0) {
          this.modeAgencyOrganize = {
            org_id: 0,
            org_cd: '',
            org_name: '',
            org_level: this.detailOrganizeMap.org_level,
            parent_id: this.detailOrganizeMap.org_id,
            org_type: '',
            isChild: false,
            de_cd: null,
          }
        } else {
          this.modeAgencyOrganize = {
            org_id: 0,
            org_cd: '',
            org_name: '',
            org_level: this.listAgencyMap.length > 0 ? 1 : 0,
            parent_id: this.listAgencyMap.length > 0 ? this.detailOrganizeMap.org_id : 0,
            org_type: '',
            isChild: false,
            de_cd: null,
          }
        }
        this.displayButton = false;

      }
    })
  }

  listOrganizeTree = []
  selectedNodeTree: any = null;
  Edit() {
    this.displayButton = false;
    this.getDepartments(this.detailOrganizeMap.parent_id);
    this.titleForm = {
      label: 'Chỉnh sửa phòng ban',
      value: 'Edit'
    }

    const queryParams = queryString.stringify({ parent_id: 1 });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listOrganizeTree = results.data;
        const queryParams1 = queryString.stringify({ parent_id: this.detailOrganizeMap.parent_id });
        this.apiService.getOrganizeTree(queryParams1).subscribe(results => {
          if (results.status === 'success' && results.data.length > 0) {
            this.selectedNodeTree = results.data[0];
            this.displayOrganize = true;
            this.modeAgencyOrganize = {
              org_id: this.detailOrganizeMap.org_id,
              org_name: this.detailOrganizeMap.label,
              org_cd: this.detailOrganizeMap.org_cd,
              org_level: this.detailOrganizeMap.org_level,
              parent_id: this.detailOrganizeMap.parent_id,
              isChild: false,
              org_type: null,
              de_cd: this.detailOrganizeMap.org_cd
            }

          }
        })
      }
    })


    // const queryParams = queryString.stringify({ org_level: this.detailOrganizeMap.org_level });
    // this.apiService.getOrganizeList(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.organizeList = results.data;
    //     this.organizeList = this.organizeList.map(d => {
    //       return {
    //         label: d.org_name,
    //         value: d.org_id
    //       }
    //     });

    //     this.organizeList = this.organizeList.filter(d => d.value !== this.detailOrganizeMap.org_id)
    //     this.displayOrganize = true;
    //     this.modeAgencyOrganize = {
    //       org_id: this.detailOrganizeMap.org_id,
    //       org_name: this.detailOrganizeMap.label,
    //       org_cd: this.detailOrganizeMap.org_cd,
    //       org_level: this.detailOrganizeMap.org_level,
    //       parent_id: this.detailOrganizeMap.parent_id,
    //       isChild: false,
    //       org_type: null,
    //       de_cd: this.detailOrganizeMap.org_cd
    //     }
    //     this.displayButton = false;
    //   }
    // })


    // this.getAgencyOrganizeList(this.modeAgencyOrganize.org_level )
  }

  Delete() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ org_id: this.detailOrganizeMap.org_id });
        this.apiService.delOrganize(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.displayButton = false;
            this.getAgencyOrganizeMap();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  onChangeCheckbox(event) {
    if (this.modeAgencyOrganize.isChild) {
      this.modeAgencyOrganize.org_level = parseInt(this.detailOrganizeMap.data.org_level) + 1
    } else {
      this.modeAgencyOrganize.org_level = this.detailOrganizeMap.data.org_level
    }
  }

  Save() {
    if (this.titleForm.value === 'Edit') {
      this.modeAgencyOrganize.parent_id = this.selectedNodeTree.org_id
    }

    if (!this.modeAgencyOrganize.org_name) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Nhập tên phòng ban' });
    }
    let params = { ...this.modeAgencyOrganize };
    // if(this.titleForm.value === 'Add') {
    //   params.parent_id = this.modeAgencyOrganize.isChild ? this.detailOrganizeMap.org_id : this.detailOrganizeMap.parent_id;
    // }
    delete params.isChild;
    delete params.de_cd;
    this.apiService.setOrganize(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thành công' });
        this.getAgencyOrganizeMap();
        this.displayOrganize = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  }

  Back() {
    this.router.navigate(['/page-agency']);
  }

  Close() {
    this.displayOrganize = false;
  }





}

