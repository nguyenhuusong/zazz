import { Component, OnInit } from '@angular/core';
import { UserManager } from 'oidc-client';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {Event, RouterEvent, Router, NavigationEnd} from '@angular/router';
import queryString from 'query-string';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    menuItems: any[] = [];
    private manager: UserManager = new UserManager(environment.authenSettings);
    listmenuChecks = []
    isWarning = 0;
    constructor(
        private router: Router,
        private authService: AuthService,
        private apiService: ApiService,
        
        private messageService: MessageService,
        private spinner: NgxSpinnerService,
    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
         ).subscribe((e: any) => {
            const pathname  = window.location.pathname ;
            if(this.menuItems.length > 0) {
                this.parseObjectProperties(this.menuItems, e.url);
                this.menuItems = [...this.menuItems];
                localStorage.setItem('menuItems', JSON.stringify(this.menuItems));
            }else {
                this.getListMenuByUserId(pathname)
            }
                // let fullUrl =  window.location.pathname.split("?");
                // let pathUrl =  fullUrl[0].split("/");
                // let pathDepth1 = '';
                // let pathDepth2 = '';
                // let pathDepth3 = '';
                // if(pathUrl[1]){
                //     pathDepth1 = '/' + pathUrl["1"]
                // }
                // if(pathUrl[2]){
                //     pathDepth2 = '/' + pathUrl["1"] + '/' + pathUrl["2"]
                // }
                // if(pathUrl[3]){
                //     pathDepth3 = '/' + pathUrl["1"] + '/' + pathUrl["2"] + '/' + pathUrl["3"]
                // }
                // if(this.listmenuChecks.length > 0) {
                //     let canActive = false;
                //     for (let i = 0; i < this.listmenuChecks.length; i++) {
                //         let currentPath = this.listmenuChecks[i].path || '';
                //         currentPath =  currentPath.split("/");
                //         let baseCurrentPath = ''
                //         if(currentPath[0]) {
                //             baseCurrentPath = '/' + currentPath[0];
                //         }
                //         if(currentPath[1]) {
                //             baseCurrentPath = '/' + currentPath[1];
                //         }
                //         if(currentPath[2]) {
                //             baseCurrentPath = '/' + currentPath[2];
                //         }
                //         if(baseCurrentPath === pathDepth1 || baseCurrentPath === pathDepth2 || baseCurrentPath === pathDepth3){
                //             canActive = true;
                //             break;
                //         }

                //     }
                //     if(!canActive){
                //         // neu khong có quyền thì quay về trang đầu tiên
                //         if(this.menuItems[0].submenus && this.menuItems[0].submenus[0]?.path) {
                //             this.router.navigate([this.menuItems[0].submenus[0].path]);
                //         }else{
                //             this.router.navigate(['/404']);
                //         }
                //     }
                //     const pathname  = window.location.pathname ;
                //     this.parseObjectProperties(this.menuItems, pathname);
                //     this.menuItems = [...this.menuItems];
                // }else{
                //     this.router.navigate['/404'];
                // }
         });
    }

    // checkMenuActive(listmenuChecks) {
    //     listmenuChecks.forEach(menu => {
    //         let fullUrl =  menu.path.split("/");
            
    //         if(pathUrl[1]){
    //             pathDepth1 = '/' + pathUrl["1"]
    //         }
    //         if(pathUrl[2]){
    //             pathDepth2 = '/' + pathUrl["1"] + '/' + pathUrl["2"]
    //         }
    //     });
    // }


    getListMenuByUserId(pathname) {
        const queryMeny = queryString.stringify({ userId: this.authService.getClaims().sub, webId: '70e930b0-ffea-43d3-b3a9-0e6b03f2b433' });
        this.apiService.clientMenuGetListByUserId(queryMeny).subscribe(results => {
            this.menuItems = results.data.filter(menuItem => menuItem);
            this.parseObjectProperties(this.menuItems, pathname);
            localStorage.setItem('menuItems', JSON.stringify(results.data));
            this.menuItems = [...this.menuItems];
        });
    }


   async ngOnInit() {
        // const pathname = window.location.pathname;
        // let fullUrl =  pathname.split("?");
        // let pathUrl =  fullUrl[0].split("/");
        // let pathDepth1 = '';
        // let pathDepth2 = '';
        // let pathDepth3 = '';
        // if(pathUrl[1]){
        //     pathDepth1 = '/' + pathUrl["1"]
        // }
        // if(pathUrl[2]){
        //     pathDepth2 = '/' + pathUrl["1"] + '/' + pathUrl["2"]
        // }
        // if(pathUrl[3]){
        //     pathDepth3 = '/' + pathUrl["1"] + '/' + pathUrl["2"] + '/' + pathUrl["3"]
        // }

        // const token = this.authService.getAccessTokenValue();
        // if (!this.firebaseAuthService.authenticated) {
        //   const customToken = await this.authService.getCustomToken(token);
        //   if (customToken) {
        //     this.firebaseAuthService.customLogin(customToken);
        //   }
        // }
        // this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //     if(results && results.length>0){
        //      const queryParams = queryString.stringify({ organizeIds: results });
        //      const queryMeny = queryString.stringify({ userId: this.authService.getClaims().sub, webId: '70e930b0-ffea-43d3-b3a9-0e6b03f2b433' });
        //     //  this.apiService.getUserMenus(queryParams).subscribe(results => {
        //     //     console.log('menu old', results)
        //     //  })
        //      this.apiService.clientMenuGetListByUserId(queryMeny).subscribe(results => {
        //     //   this.apiService.getUserMenus(queryParams).subscribe(results => {
        //            if (results.status === 'success') {
        //                this.menuItems = results.data;
        //                this.convetArry(this.menuItems);
        //                if(this.listmenuChecks.length > 0) {
        //                     let canActive = false;
        //                     for (let i = 0; i < this.listmenuChecks.length; i++) {
        //                         let currentPath = this.listmenuChecks[i].path || '';
        //                         currentPath =  currentPath.split("/");
        //                         let baseCurrentPath = ''
        //                         if(currentPath[0]) {
        //                             baseCurrentPath = '/' + currentPath[0];
        //                         }
        //                         if(currentPath[1]) {
        //                             baseCurrentPath = '/' + currentPath[1];
        //                         }
        //                         if(currentPath[2]) {
        //                             baseCurrentPath = '/' + currentPath[2];
        //                         }
        //                         if(baseCurrentPath === pathDepth1 || baseCurrentPath === pathDepth2 || baseCurrentPath === pathDepth3){
        //                             canActive = true;
        //                             break;
        //                         }
        
        //                     }
        //                     if(!canActive){
        //                         // neu khong có quyền thì quay về trang đầu tiên
        //                         if(this.menuItems[0].submenus && this.menuItems[0].submenus[0]?.path) {
        //                             this.router.navigate([this.menuItems[0].submenus[0].path]);
        //                         }else{
        //                             this.router.navigate(['/404']);
        //                         }
        //                     }
        //                     const pathname  = window.location.pathname ;
        //                     this.parseObjectProperties(this.menuItems, pathname);
        //                     this.menuItems = [...this.menuItems];
        //                 }else{
        //                     this.router.navigate['/404'];
        //                 }
        //                localStorage.setItem('menuItems', JSON.stringify(results.data));
        //                this.parseObjectProperties(this.menuItems, pathDepth1);
        //                this.menuItems = [...this.menuItems];
        //            }
        //        });
        //     }else{
        //         this.router.navigate(['/404']);
        //     }
        // });
        // // this.menuItems = ROUTES.filter(menuItem => menuItem);
        // //         this.parseObjectProperties(this.menuItems, pathname);
        // //         this.menuItems = [...this.menuItems];
    }

    convetArry(datas) {
        for(let item of datas) {
            this.listmenuChecks.push(item);
            if(item.submenus && item.submenus.length > 0) {
                this.convetArry(item.submenus);
            }
        }
    }

    parseObjectProperties(obj: any[], pathname) {
        for (let k of obj) {
            k.label = k.title;
            k.styleClass = 'parent_no_active' + ' ' + k.classs
            if (k.path && k.classs !== 'navigation-header') {
                k.routerLink = k.path;
                k.icon = '';
            }
            if (k.path && k.classs === 'nav-link') {
                k.routerLink = k.path
            }
            if (k.submenus && k.submenus.length > 0) {
                k.items = k.submenus.filter((d: any) => d.classs && (d.classs.indexOf("hidden") < 0));
            }
            if (k.routerLink) {
                // active menu con
              
                if(k.isExternalLink) {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = 'parent_active' + ' ' + k.classs
                    } else {
                        k.styleClass = 'parent_no_active' + ' ' + k.classs
                    }
                }else {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = k.classs + ' active' + ' ' + k.classs;
                        k.icon = ''
                    } else {
                        k.styleClass = k.classs + ' no-active' + ' ' + k.classs;
                        k.icon = ''
                    }
                }
               
            } else {
                const items = k.submenus.filter(i => pathname.includes(i.path));
                if(items.length > 0) k.styleClass = "parent_active" + ' ' + k.classs
            }

            if (k.hasOwnProperty('items') && Array.isArray(k.items) && k.items.length > 0) {
                this.parseObjectProperties(k.items, pathname);
            }
        }
    }

    findNodeInTree2(list, nodeId, element1): any {
        for (let i = 0; i < list.length; i++) {
          if (list[i].path === nodeId ) {
             element1.columnValue = list[i].badgeClass;
             break;
            }else if (Array.isArray(list[i].submenus) && list[i].submenus.length) {
              this.findNodeInTree2(list[i].submenus, nodeId, element1);
            }
        }
      }

}