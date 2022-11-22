import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { findNodeInTree } from 'src/app/common/function-common/objects.helper';
@Component({
  selector: 'app-cai-dat-to-chuc',
  templateUrl: './cai-dat-to-chuc.component.html',
  styleUrls: ['./cai-dat-to-chuc.component.scss']
})
export class CaiDatToChucComponent implements OnInit {
  pagingComponent = {
    total: 0
  };
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  selectedValue = null
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
  isHrDiagram: boolean = false
  organizeIdSelected = ''
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
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
    orgId: 0,
    isLock: -1,
    isApprove: -1,
    org_level: 0,
    organizeIds: '',
  }

  organizeIdsParam = '';

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
    orgId: null,
    organizeId: null,
    org_name: '',
    org_level: 0,
    parentId: null,
    org_type: '',
    isChild: false,
    de_cd: null
  }
  departments = [];
  cancel() {
    this.selectedValue = null
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      orgId: this.selectedValue,
      isLock: -1,
      isApprove: -1,
      org_level: 0,
      organizeIds: this.query.organizeIds
    }
    this.load()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  

  getAgencyOrganizeMap(type = false) {
    this.spinner.show();
    this.apiService.getAgencyOrganizeMap().subscribe(results => {
      if (results.status === 'success') {
        this.listAgencyMap = [...results.data.root];
        if (localStorage.getItem("organize") === null) {
          this.selectedNode = this.listAgencyMap[0];
          this.detailOrganizeMap = this.selectedNode
          localStorage.setItem('organize', JSON.stringify(this.listAgencyMap[0]));
          this.query.orgId = this.selectedNode.orgId;
          this.query.org_level = this.selectedNode.org_level;
          this.load();
        } else {
          this.selectedNode = JSON.parse(localStorage.getItem("organize"));
          this.query.orgId = this.selectedNode.orgId;
          this.parseObjectProperties(this.listAgencyMap, this.selectedNode.organizeId);
          this.detailOrganizeMap = this.selectedNode
          this.selected(this.listAgencyMap, this.query.orgId);
          this.query.org_level = this.selectedNode.org_level;
          if (type) {
            this.isHrDiagram = true;
          }
          this.load();
        }
        this.spinner.hide();
      }
    })
  }

  addPosition() {
    const params = {
      org_level: this.detailOrganizeMap.org_level
    }
    this.router.navigate(['/cai-dat/chuc-vu'], { queryParams: params });
  }


  parseObjectProperties(obj, organizeId = null) {
    for (let k of obj) {
      if (k.organizeId === organizeId) {
        k.expanded = true;
        if (k.hasOwnProperty('children') && Array.isArray(k.children) && k.children.length > 0 && k.org_level < this.selectedNode.org_level) {
          this.parseObjectProperties(k.children, organizeId);
        }
      } else {
        if (k.hasOwnProperty('children') && Array.isArray(k.children) && k.children.length > 0) {
          this.parseObjectProperties(k.children, organizeId);
        }
      }
    }
  }



  // expanded(datas = [], orgId = 0) {
  //   datas.forEach(d => {
  //     if (d.orgId === orgId) {
  //       d.expanded = true;
  //     } else {
  //       if (d.children.length > 0) this.expanded(d.children, this.selectedNode.parentId)
  //     }
  //   })
  //   return datas
  // }

  selected(datas = [], orgId = 0) {
    datas.forEach(d => {
      if (d.orgId === orgId) {
        this.selectedNode = d;
        this.detailOrganizeMap = d;
      } else {
        if (d.children.length > 0) this.selected(d.children, this.selectedNode.orgId)
      }
    }
    )
  }

  getOrganizeLevelList(parentId) {
    const queryParams = queryString.stringify({parentId: parentId});
    this.apiService.getOrganizeLevelList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organizeLevelList = results.data.map(d => {
          return {
            label: d.org_level_name,
            value: d.org_level
          }
        });
        this.modeAgencyOrganize.org_level = this.modeAgencyOrganize.org_level ? this.modeAgencyOrganize.org_level :this.organizeLevelList[0].value 
      }
    })
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = {... this.query};
    params.orgId = this.selectedValue ? this.selectedValue.orgId : null;
    this.organizeIdsParam = '';
    const queryParams = queryString.stringify(params);
    this.apiService.getOrganizePage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
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
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.editOrgin.bind(this),
          label: 'Sửa tổ chức',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT)
        },
        {
          onClick: this.delOrgin.bind(this),
          label: 'Xóa tổ chức',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  editOrgin(event) {
    this.getOrganizeLevelList(event.rowData.parentId);
    this.modeAgencyOrganize.organizeId = this.query.organizeIds;
    this.modeAgencyOrganize.org_level = event.rowData.org_level;
    this.modeAgencyOrganize.org_name = event.rowData.org_name;
    this.modeAgencyOrganize.orgId = event.rowData.orgId;
    // this.selectedNodeTree = event.rowData.orgId;
    this.modeAgencyOrganize.parentId = event.rowData.parentId
    this.getOrganizeTreeByOr();
    this.displayOrganize = true;
   
    
  }
  delOrgin(event) {
    this.spinner.show();
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ orgId: event.rowData.orgId });
        this.apiService.delOrganize(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.displayButton = false;
            this.getAgencyOrganizeMap();
            this.spinner.hide();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: '',
        maxWidth: 60,
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox2',
        suppressSizeToFit: true,
      },
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
      orgId: event.rowData.orgId
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
    // const queryParams = queryString.stringify({ org_level: org_level });
    // this.apiService.getOrganizeList(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.organizeList = results.data;
    //     this.organizeList = this.organizeList.map(d => {
    //       return {
    //         label: d.org_name,
    //         value: d.orgId
    //       }
    //     })
    //   }
    // })
  }

  selectDepartment(event) {
    const items = this.departments.filter(d => d.value === this.modeAgencyOrganize.de_cd);
    this.modeAgencyOrganize.organizeId = items[0].value
    this.modeAgencyOrganize.org_name = items[0].label
  }

  getDepartments(parentId) {
    const queryParams = queryString.stringify({ parentId: parentId })
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
    this.getOrrginiaztions();
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
          if(results && results.length>0){
            this.query.organizeIds = results;
            this.organizeIdSelected = results;
            this.getBoPhan();
            this.getAgencyOrganizeMap();
          }
    });
    
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
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
  }

  caiDatThamSo() {
    if (this.query.organizeIds) {
      const params = {
        organizeId: this.organizeIdsParam
      }
      this.router.navigate(['/cai-dat/cai-dat-tham-so'], { queryParams: params });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không tìm thấy tổ chức' });
    }
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
    this.isHrDiagram = false;
    this.getlistnv();
    // this.displayButton = true;
  }

  getlistnv() {
    localStorage.setItem("organize", JSON.stringify(this.detailOrganizeMap))
    this.query.orgId = this.detailOrganizeMap.orgId;
    this.query.org_level = this.detailOrganizeMap.org_level;
    this.load();
    this.displayButton = false;
  }
  organizes = []
  getOrrginiaztions() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if(results.status === 'success') {
          this.organizes = results.data.map(d => {
            return {
              label: d.organizationName,
              value: `${d.organizeId}`
            }
          });
          this.organizes = [{label: 'UNION-SUNSHINE', value: null}, ...this.organizes];
      }
    })
  }

  rowSelected(event) {
    if(event.length>0){
      this.organizeIdsParam = event[0].orgId;
    }else{
      this.organizeIdsParam = ''
    }
  }

  getOrganizeList(organizeId) {
    const queryParams = queryString.stringify({ org_level: this.detailOrganizeMap.org_level, organizeId: organizeId });
    this.apiService.getOrganizeList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.organizeList = results.data;
        this.organizeList = this.organizeList.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        })
      }
    })
  }

  Add() {
    this.titleForm = {
      label: 'Thêm mới phòng ban',
      value: 'Add'
    }
    
    if (this.detailOrganizeMap.parentId) {
      // this.getOrganizeTree(this.detailOrganizeMap.organizeId);
      this.getOrganizeLevelList(this.detailOrganizeMap.organizeId);
      this.modeAgencyOrganize = {
        orgId: null,
        organizeId: this.query.organizeIds,
        org_name: '',
        org_level: this.detailOrganizeMap.org_level + 1,
        parentId: this.detailOrganizeMap.orgId,
        org_type: '',
        isChild: false,
        de_cd: null,
      }
    } else {
      this.modeAgencyOrganize = {
        orgId: null,
        organizeId: this.listAgencyMap.length > 0 ? this.detailOrganizeMap.organizeId : null,
        org_name: '',
        org_level: this.listAgencyMap.length > 0 ? 1 : 0,
        parentId: null,
        org_type: '',
        isChild: false,
        de_cd: null,
      }
    }
    this.displayOrganize = true;
    this.displayButton = false;
    this.getOrganizeTreeByOr();
  }
  listOrganizeTreeByOr = []
  getOrganizeTreeByOr() {
    this.selectedNodeTree =null
    const queryParams = queryString.stringify({ parentId: this.organizeIdSelected });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listOrganizeTreeByOr = results.data;
        this.findNodeInTree(this.listOrganizeTreeByOr, this.modeAgencyOrganize.parentId);
      }
    })
  }

  findNodeInTree(list, nodeId): any {
    for (let i = 0; i < list.length; i++) {
      if (list[i].data === nodeId ) {
        this.selectedNodeTree = list[i];
        }else if (Array.isArray(list[i].children) && list[i].children.length) {
          this.findNodeInTree(list[i].children, nodeId);
        }
    }
  }


  getOrganizeTree(organizeId) {
    const queryParams = queryString.stringify({ parentId: organizeId });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listOrganizeTree = results.data;
        const queryParams1 = queryString.stringify({ parentId: this.detailOrganizeMap.orgId });
        this.apiService.getOrganizeTree(queryParams1).subscribe(results => {
          if (results.status === 'success' && results.data.length > 0) {
            // this.selectedNodeTree = results.data[0];
          }
        })
      }
    })
  }

  departmentFiltes = [];
  getBoPhan () {
    const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
   this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }
  onChangeTreeDepart(event) {

  }
  
  onNodeSelectAdd(event) {
    // this.getDepartments(event.node.parentId);
    this.getOrganizeLevelList(event.node.data);
  }

  onSelectOrgan() {
    this.getOrganizeTreeByOr();
  }

  listOrganizeTree = []
  selectedNodeTree: any = '';
  Edit() {
    this.displayButton = false;
    this.getOrganizeLevelList(this.detailOrganizeMap.parentId);
    this.titleForm = {
      label: 'Chỉnh sửa phòng ban',
      value: 'Edit'
    }
    this.listOrganizeTree = [];
    const queryParams = queryString.stringify({ parentId: this.detailOrganizeMap.organizeId });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listOrganizeTree = results.data;
        const queryParams1 = queryString.stringify({ parentId: this.detailOrganizeMap.parentId });
        this.apiService.getOrganizeTree(queryParams1).subscribe(results => {
          if (results.status === 'success' && results.data.length > 0) {
            this.selectedNodeTree = results.data[0];
            this.modeAgencyOrganize = {
              orgId: this.detailOrganizeMap.orgId,
              org_name: this.detailOrganizeMap.label,
              organizeId: this.detailOrganizeMap.organizeId,
              org_level: this.detailOrganizeMap.org_level,
              parentId: this.detailOrganizeMap.parentId,
              isChild: false,
              org_type: null,
              de_cd: this.detailOrganizeMap.organizeId
            }
            this.displayOrganize = true;

          }
        })
      }
    })

  }

  Delete() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ orgId: this.detailOrganizeMap.orgId });
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
    // typeof this.organizeIdSelected === 'string' ? this.organizeIdSelected : this.organizeIdSelected.data;
    if (this.titleForm.value === 'Edit') {
      this.modeAgencyOrganize.parentId = this.organizeIdSelected
    }

    if (!this.modeAgencyOrganize.org_name) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Nhập tên phòng ban' });
      return
    }
    this.modeAgencyOrganize.organizeId = this.organizeIdSelected;
    this.modeAgencyOrganize.parentId = this.selectedNodeTree?.data;
    let params = { ...this.modeAgencyOrganize };
    // if(this.titleForm.value === 'Add') {
    //   params.parentId = this.modeAgencyOrganize.isChild ? this.detailOrganizeMap.orgId : this.detailOrganizeMap.parentId;
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

  hrDiagram() {
    this.selectedNode = null;
    this.listAgencyMap = []
    this.isHrDiagram = true;
    this.getAgencyOrganizeMap(true);
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

}

