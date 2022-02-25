import { Component, OnInit } from '@angular/core';
import { UserManager } from 'oidc-client';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {Event, RouterEvent, Router} from '@angular/router';
declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    menuItems: any[] = [];
    private manager: UserManager = new UserManager(environment.authenSettings);
    constructor(
        private router: Router,
        private authService: AuthService,
        private apiService: ApiService,
    ) {
        
        router.events.pipe(
            filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
         ).subscribe((e: RouterEvent) => {
             if(this.menuItems.length > 0) {
                const pathname  = window.location.pathname ;
                this.parseObjectProperties(this.menuItems, e.url);
                this.menuItems = [...this.menuItems];
             }
         });
    }

    ngOnInit() {
        const pathname = window.location.pathname;
        console.log(pathname)

        this.manager.getUser().then(user => {
            this.apiService.getListMenuByUserId(user.profile.sub, '3133579B-4FD9-449E-9CEA-4B384884E7D3').subscribe(results => {
                this.menuItems = results.data.filter(menuItem => menuItem);
                this.parseObjectProperties(this.menuItems, pathname);
                this.menuItems = [...this.menuItems];
                // localStorage.setItem('menuItems',JSON.stringify(results.data));

            })
        });

        // this.menuItems = ROUTES.filter(menuItem => menuItem);
        //         this.parseObjectProperties(this.menuItems, pathname);
        //         this.menuItems = [...this.menuItems];
    }

    parseObjectProperties(obj: any[], pathname) {
        for (let k of obj) {
            k.label = k.title;
            if (k.path && k.classs !== 'navigation-header') {
                k.routerLink = k.path
            }
            if (k.submenus && k.submenus.length > 0) {
                k.items = k.submenus.filter((d: any) => d.classs && (d.classs.indexOf("hidden") < 0));
            }
            if (k.routerLink) {
                // active menu con
                if(k.isExternalLink) {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = 'parent_active'
                    } else {
                        k.styleClass = 'parent_no_active'
                    }
                }else {
                    if (k.routerLink && pathname.includes(k.routerLink)) {
                        k.styleClass = k.classs + ' active'
                        k.icon = ''
                    } else {
                        k.styleClass = k.classs + ' no-active';
                        k.icon = ''
                    }
                }
               
            } else {
                //active cha
                if (k.path && pathname && pathname.split('/').indexOf(k.path) > -1 && k.classs === 'navigation-header') {
                    k.styleClass = k.classs + " parent_active"
                } else {
                    k.styleClass = k.classs + " parent_no_active"
                }
            }

            if (k.hasOwnProperty('items') && Array.isArray(k.items) && k.items.length > 0) {
                this.parseObjectProperties(k.items, pathname);
            }
        }
    }

}
