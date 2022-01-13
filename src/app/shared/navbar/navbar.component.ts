import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    userName = '';
    avatarUrl = '';
    items: MenuItem[] = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        // private themeService: ThemeService
    ) {
        this.items = [{
            label: 'Logout',
            icon: 'pi pi-refresh',
            command: () => {
                this.logout();
            }
            // items: [{
            //     label: 'Logout',
               
            // },
            // {
            //     label: 'Delete',
            //     icon: 'pi pi-times',
            //     command: () => {
            //         this.delete();
            //     }
            // }
        }];
    }

    logout() {
        this.authService.signout();
    }

    ngOnInit() {
        this.userName = this.authService.getUserName();
    }

    update() {

    }

    delete() {

    }

    // changeTheme(theme: string) {
    //     this.themeService.switchTheme(theme);
    // }
      
}
