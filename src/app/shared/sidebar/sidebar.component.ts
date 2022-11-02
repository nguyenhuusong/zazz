import { Component, OnInit } from '@angular/core';
import { UserManager } from 'oidc-client';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {Event, RouterEvent, Router} from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import * as queryString from 'querystring';
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
    constructor(
        private router: Router,
        private authService: AuthService,
        private apiService: ApiService,
        private firebaseAuthService: FirebaseAuthService,
        private organizeInfoService: OrganizeInfoService,
        private messageService: MessageService,
        private spinner: NgxSpinnerService,
    ) {
        // console.log('this.router.url', this.router.url)
        router.events.pipe(
            filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
         ).subscribe((e: RouterEvent) => {
            let fullUrl =  e.url.split("?");
            let pathUrl =  fullUrl[0].split("/");
            let pathUrl1 = '/';
            let pathDepth2 = '/';
            pathUrl1 = pathUrl1.concat(pathUrl["1"])
            if(pathUrl[2]){
                pathUrl1 = pathUrl1.concat("/").concat(pathUrl["2"]);
                // pathDepth2 = pathDepth2.concat(pathUrl["1"]).concat("/").concat(pathUrl["2"]);
            }
            // if(pathUrl[3]){
            //     pathUrl1 = pathUrl1.concat("/").concat(pathUrl["3"])
            // }
            if(this.listmenuChecks.length > 0) {
                // let itemsEx = this.listmenuChecks.filter( d => {
                //     return d.path === pathUrl1 || d.path === pathDepth2
                // });
                // console.log('url curent', e)
                // if(itemsEx.length <= 0){
                //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không có quyền truy cập' });
                //     this.router.navigate([this.listmenuChecks[0].path]);
                // }
                if(this.listmenuChecks.map(d => d.path).indexOf(pathUrl1) < 0) {
                    this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không có quyền truy cập' });
                    this.router.navigate([this.listmenuChecks[0].path]);
                }
                const pathname  = window.location.pathname ;
                this.parseObjectProperties(this.menuItems, pathname);
                this.menuItems = [...this.menuItems];
            }else{
                this.router.navigate['/404'];
            }
         });
    }
   async ngOnInit() {
        const pathname = window.location.pathname;
        let fullUrl =  pathname.split("?");
        let pathUrl =  fullUrl[0].split("/");
        let pathUrl1 = '/';
        pathUrl1 = pathUrl1.concat(pathUrl["1"])
        let pathDepth2 = '/';
        if(pathUrl[2]){
            pathUrl1 = pathUrl1.concat("/").concat(pathUrl["2"]);
            // pathDepth2 = pathUrl1.concat("/").concat(pathUrl["2"])
        }
        // if(pathUrl[3]){
        //     pathUrl1 = pathUrl1.concat("/").concat(pathUrl["3"])
        // }
        const token = this.authService.getAccessTokenValue();
        if (!this.firebaseAuthService.authenticated) {
          const customToken = await this.authService.getCustomToken(token);
          if (customToken) {
            this.firebaseAuthService.customLogin(customToken);
          }
        }
        this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
            if(results && results.length>0){
             const queryParams = queryString.stringify({ organizeIds: results });
              this.apiService.getUserMenus(queryParams).subscribe(results => {
                   if (results.status === 'success') {
                       this.menuItems = results.data;
                       this.convetArry(this.menuItems);
                       if(this.listmenuChecks.length > 0) {

                        //    let itemsEx = this.listmenuChecks.filter( d => {
                        //         return d.path === pathUrl1 || d.path === pathDepth2
                        //     });
                        //     if(itemsEx.length <= 0){
                        //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không có quyền truy cập' });
                        //         this.router.navigate([this.listmenuChecks[0].path]);
                        //     }

                            if(this.listmenuChecks.map(d => d.path).indexOf(pathUrl1) < 0) {
                                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không có quyền truy cập' });
                                this.router.navigate([this.listmenuChecks[0].path]);
                            }
                        }else{
                            this.router.navigate(['/404']);
                        }
                       localStorage.setItem('menuItems', JSON.stringify(results.data));
                       this.parseObjectProperties(this.menuItems, pathUrl1);
                       this.menuItems = [...this.menuItems];
                   }
               });
            }else{
                this.router.navigate(['/404']);
            }
        });
        // this.menuItems = ROUTES.filter(menuItem => menuItem);
        //         this.parseObjectProperties(this.menuItems, pathname);
        //         this.menuItems = [...this.menuItems];
    }

    convetArry(datas) {
        for(let item of datas) {
            this.listmenuChecks.push(item);
            if(item.submenus.length > 0) {
                this.convetArry(item.submenus);
            }
        }
    }

    parseObjectProperties(obj: any[], pathname) {
        for (let k of obj) {
            k.label = k.title;
            if (k.path && k.class !== 'navigation-header') {
                k.routerLink = k.path
                k.styleClass = 'nav-item';
                k.class = 'nav-item';
            }
            if (k.submenus && k.submenus.length > 0) {
                k.items = k.submenus.filter((d: any) => d.class && (d.class.indexOf("hidden") < 0));
            }
            if (k.routerLink) {
                // active menu con
                if(k.isExternalLink) {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = 'parent_active' + ' ' + k.class
                    } else {
                        k.styleClass = 'parent_no_active' + ' ' + k.class
                    }
                }else {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = k.class + ' active' + ' ' + k.class
                        k.icon = ''
                    } else {
                        k.styleClass = k.class + ' no-active'; + ' ' + k.class
                        k.icon = ''
                    }
                }
               
            } else {
                //active cha
                if (k.path && pathname && pathname.split('/').indexOf(k.path) > -1 && k.class === 'navigation-header') {
                    k.styleClass = k.class + " parent_active" + ' ' + k.class
                } else {
                    k.styleClass = k.class + " parent_no_active" + ' ' + k.class
                }
            }

            if (k.hasOwnProperty('items') && Array.isArray(k.items) && k.items.length > 0) {
                this.parseObjectProperties(k.items, pathname);
            }
        }
    }

}
