import { Component, OnInit } from '@angular/core';
import { UserManager } from 'oidc-client';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {Event, RouterEvent, Router} from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
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
        private firebaseAuthService: FirebaseAuthService,
    ) {
        
        router.events.pipe(
            filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
         ).subscribe((e: RouterEvent) => {
             if(this.menuItems.length > 0) {
                const pathname  = window.location.pathname ;
                this.parseObjectProperties(this.menuItems, pathname);
                this.menuItems = [...this.menuItems];
             }
         });
    }

   async ngOnInit() {
        const pathname = window.location.pathname;
        const token = this.authService.getAccessTokenValue();
        if (!this.firebaseAuthService.authenticated) {
          const customToken = await this.authService.getCustomToken(token);
          if (customToken) {
            this.firebaseAuthService.customLogin(customToken);
          }
        }
       this.apiService.getUserMenus().subscribe(results => {
                if (results.status === 'success') {
                    this.menuItems = results.data;
                    localStorage.setItem('menuItems',JSON.stringify(results.data));
                    this.parseObjectProperties(this.menuItems, pathname);
                    this.menuItems = [...this.menuItems];
                }
            });
        // this.menuItems = ROUTES.filter(menuItem => menuItem);
        //         this.parseObjectProperties(this.menuItems, pathname);
        //         this.menuItems = [...this.menuItems];
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
