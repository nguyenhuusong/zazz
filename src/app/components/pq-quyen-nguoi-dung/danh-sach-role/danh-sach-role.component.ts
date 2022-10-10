import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridFn } from 'src/app/common/function-common/common';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-danh-sach-role',
  templateUrl: './danh-sach-role.component.html',
  styleUrls: ['./danh-sach-role.component.scss']
})
export class DanhSachRoleComponent implements OnInit {
  @Input() detailInfo: any = null;
  @Output() callback = new EventEmitter<any>();
  optionsButon = [
    // { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-plus' }
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  columnDefs = [];
  listsData = []
  heightGrid = 500;
  gridKey = 'view_sysconfig_roles'
  displaySetting = false;
  dataMenuActionRole: any = []
  cauhinh() {
    this.displaySetting = true;
  }
  ngOnInit(): void {
    // this.getClientRolePageByWebId()
    // this.getWebMenuTree()
    this.getRoles();
  }
  listMenuTree = []
  getRoles() {
    this.columnDefs = []
    const query = {  }
    this.apiService.getMenuConfigInfo(queryString.stringify(query)).subscribe((results: any) => {
      if (results.status === 'success') {
        this.listsData = cloneDeep(results?.data?.roles);
        this.dataMenuActionRole = results.data;
        this.listMenuTree = cloneDeep(results?.data?.menutree)
        this.menus = cloneDeep(this.listMenuTree);
        if(results.data && results.data.view_grids_action){
          this.initGrid(results.data.view_grids_roles);
        }
      }
    })
  }

  getClientRolePageByWebId() {
    this.columnDefs = []
    this.apiService.getUserMenus().subscribe(results => {
      if (results.status === 'success') {
        this.listsData = cloneDeep(results.data.dataList.roles);
        this.initGrid(results.data.gridflexs);
      }
    })
  }
  listActions = [];
  sourceActions = [];
  targetActions = [];
  menus: any = [];
  // getWebMenuTree() {
  //   this.columnDefs = []
  //   const queryParams = queryString.stringify({ webId: this.detailInfo.webId });
  //   this.apiService.getWebMenuTree(queryParams).subscribe(results => {
  //     if (results.status === 'success') {
  //       this.menus = cloneDeep(results.data);
  //     }
  //   })
  // }

  onTargetFilter(event) {
    if (event.query === "") {
      this.targetActions = cloneDeep(this.listActions)
    } else {
      this.targetActions = cloneDeep(event.value)
    }
  }

  create() {
    this.getRoleInfo()
  }

  initGrid(gridflexs) {
    this.columnDefs = [
      ...AgGridFn(gridflexs),
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: 'right',
        width: 90,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.suaThongTin.bind(this),
                label: 'Xem thông tin',
                icon: 'fa fa-edit',
                class: 'btn-primary mr5',
              },

              {
                onClick: this.delete.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                class: 'btn-primary mr5',
              },

            ]
          };
        },
      },
    ];
  }


  suaThongTin(event) {
    this.getRoleInfo(event.rowData.roleId);
  }

  listViews = [];
  detailDetailInfo = null;
  displayInfo = false;
  getRoleInfo(id = null) {
    this.listViews = [];
    this.displayInfo = true;
    const queryParams = queryString.stringify({ id: id});
    this.apiService.getRoleInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailDetailInfo = results.data;
        this.sourceActions = results.data.actions;
        this.displayInfo = true;
      }
    })
  }

  delete(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const queryParams = queryString.stringify({ id: event.rowData.roleId });
        this.apiService.deleteRole(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.callback.emit();
            this.getRoles();
            this.displayInfo = false
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
          }
        });
      }
    })
  }

  setConfigMenu(data) {
    this.spinner.show();
    const params = {
      ...this.detailDetailInfo, group_fields: data
    };
    this.apiService.SetRoleInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
        this.getRoles();
        this.displayInfo = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }), error => {
      this.spinner.hide();
    };
  }

  onHideMenuRole(e) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn lưu lại danh sách menu không?',
      accept: () => {
        const arrayMenus = []
        this.menus.forEach(res => {
          if (res.isCheck) {
            arrayMenus.push({
              menuRoleId: res.menuRoleId,
              menuId: res.menuId,
              menuCd: res.menuCd,
              webId: res.webId,
              webRoleId: res.webRoleId,
              userId: res.userId,
              roleCd: res.roleCd,
              title: res.title,
              tabId: res.tabId,
              tabCd: res.tabCd,
              intPos: res.intPos,
              actions: res.actions && res.actions.length > 0 ? res.actions.filter(action => action.isCheck) : []
            })
          }
          if(res.submenus){
            res.submenus.forEach(element => {
              if (element.isCheck) {
                arrayMenus.push({
                  menuRoleId: element.menuRoleId,
                  menuId: element.menuId,
                  menuCd: element.menuCd,
                  webId: element.webId,
                  webRoleId: element.webRoleId,
                  userId: element.userId,
                  roleCd: element.roleCd,
                  title: element.title,
                  tabId: element.tabId,
                  tabCd: element.tabCd,
                  intPos: element.intPos,
                  actions: element.actions && element.actions.length > 0 ? element.actions.filter(action => action.isCheck) : []
                })
              }
            });
          }
        })
        this.detailDetailInfo.rolemenu = arrayMenus;
        this.setConfigMenu(this.detailDetailInfo.group_fields);
      },
      reject: () => {
        this.displayMenuRole = false;
      }
    })
  }

  displayMenuRole = false;

  changeModelintPosParent(event, index) {
    this.menus[index].intPos = event.target.value;
    this.menus.sort(this.compare_qty)
  }

  changeModelintPosChilrden(event, idxParent, index) {
    this.menus[idxParent].submenus[index].intPos = event.target.value;
    this.menus[idxParent].submenus.sort(this.compare_qty)
  }

  changeActionChirlden(idxParent, index, actionIdx) {
    this.menus[idxParent].submenus[index].actions[actionIdx].isCheck = !this.menus[idxParent].submenus[index].actions[actionIdx].isCheck;
  }

  changeActionAdministration(index, actionIdx) {
    this.menus[index].actions[actionIdx].isCheck = !this.menus[index].actions[actionIdx].isCheck;
  }

  changeMenuParent(menu, index) {
    // this.menus[index].isCheck = !this.menus[index].isCheck;
    // if (this.menus[index].isCheck) {
    //   if(this.menus[index].submenus){
    //     this.menus[index].submenus = this.menus[index].submenus.map(result => {
    //       return { ...result, isCheck: true };
    //     })
    //   }
    // } else {
    //   if(this.menus[index].submenus){
    //     this.menus[index].submenus = this.menus[index].submenus.map(result => {
    //       return { ...result, isCheck: false };
    //     })
    //   }
    // }

    // this.menus = [...this.menus];

    this.menus[index].isCheck = !this.menus[index].isCheck;
    if (this.menus[index].isCheck) {
      this.menus[index].submenus = this.menus[index].submenus.map(result => {
        return { ...result, isCheck: true };
      })
    } else {
      this.menus[index].submenus = this.menus[index].submenus.map(result => {
        return { ...result, isCheck: false };
      })
    }

    this.menus = [...this.menus];
  }

  
  changeMenuChirlden(idxParent, index) {
    this.menus[idxParent].submenus[index].isCheck = !this.menus[idxParent].submenus[index].isCheck;
    if (this.menus[idxParent].submenus[index].isCheck) {
      this.menus[idxParent].isCheck = true
    } else {
      let arrChecks = this.menus[idxParent].submenus.map(res => res.isCheck);
      if (arrChecks.includes(true)) {
        this.menus[idxParent].isCheck = true;
      } else {
        this.menus[idxParent].isCheck = false;
      }
    }
    
    if (this.menus[idxParent].submenus[index].isCheck) {
      this.menus[idxParent].submenus[index].actions = this.menus[idxParent].submenus[index].actions.map(result => {
        return { ...result, isCheck: true };
      })
    } else {
      this.menus[idxParent].submenus[index].actions = this.menus[idxParent].submenus[index].actions.map(result => {
        return { ...result, isCheck: false };
      })
    }
    // this.menus[idxParent].listmenu[index] = [...this.menus[idxParent].listmenu[index]];
  }

  clickRowRoleGetMenu(event) {
    this.detailDetailInfo = null;
    this.menus = cloneDeep(this.listMenuTree);
    this.menus.forEach(m => {
      m.isCheck = false;
      m.isCheckAll = false;
      if(m.submenus){
        m.submenus.forEach(d => {
          d.isCheck = false
        })
      }
    });
    // this.detailRole = event.data
    this.getRoleInfoSidebar(event.data.roleId);
    this.displayMenuRole = true;
  }

  listMenuRoles = []
  getRoleInfoSidebar(id) {
    const queryParams = queryString.stringify({ id: id });
    this.apiService.getRoleInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.detailDetailInfo = results.data;
        this.listMenuRoles = cloneDeep(this.detailDetailInfo.rolemenu);
        this.menus.forEach(m => {
          if (this.listMenuRoles.map(q => q.menuId).indexOf(m.menuId) > -1) {
            m.isCheck = true;
            this.listMenuRoles.forEach(a => {
              if (m.menuId === a.menuId) {
                if (a.actions && a.actions.length > 0) {
                  m.actions.forEach(action => {
                    a.actions.forEach(action1 => {
                      if (action.actionId === action1.actionId) {
                        action.isCheck = true;
                      }
                    })
                  });
                  console.log(m)
                } else {
                 m.actions.forEach(action => action.isCheck = false)
                }
      
              }
            })
          } else {
            m.isCheck = false;
          }
          if(m.submenus){
            m.submenus.forEach(d => {
              if (this.listMenuRoles.map(q => q.menuId).indexOf(d.menuId) > -1) {
                d.isCheck = true;
                //load is check action
          
                this.listMenuRoles.forEach(a => {
                  if (d.menuId === a.menuId) {
                    if (a.actions && a.actions.length > 0) {
                      d.actions.forEach(action => {
                        a.actions.forEach(action1 => {
                          if (action.actionId === action1.actionId) {
                            action.isCheck = true;
                          }
                        })
                      });
                    } else {
                      d.actions.forEach(action => action.isCheck = false)
                    }
          
                  }
                })
              } else {
                d.isCheck = false;
              }
              this.listMenuRoles.forEach(g => {
                if (g.menuId === d.menuId) {
                  d.intPos = g.intPos;
                }
              })
            });
            m.submenus.sort(this.compare_qty)
            this.listMenuRoles.forEach(g => {
              if (g.menuId === m.menuId) {
                m.intPos = g.intPos;
              }
            })
          }
        });
        this.menus = [...this.menus].sort(this.compare_qty);
        console.log(this.menus )
      }
    })

  }


  compare_qty(a, b) {
    // a should come before b in the sorted order
    if (a.intPos < b.intPos) {
      return -1;
      // a should come after b in the sorted order
    } else if (a.intPos > b.intPos) {
      return 1;
      // a and b are the same
    } else {
      return 0;
    }
  }

  cancelUpdate(data) {
    if (data === 'CauHinh') {
      this.getRoleInfo(this.detailDetailInfo.roleId);
    }
  }

}
