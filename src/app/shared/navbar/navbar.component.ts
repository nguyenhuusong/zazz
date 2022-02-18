import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    userName = '';
    avatarUrl = '';
    items: MenuItem[] = [];
    isShowChangePassword = false;
    modelPass = {
        userLogin: '',
        userPassword: '',
        userPassCf: ''
      }
    confimPassword = false;
    submitPass = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private apiService: ApiService,
        private messageService: MessageService
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
        },
        {
            label: 'Thay đổi mật khẩu',
            icon: 'pi pi-user-edit',
            command: () => {
                this.changePassword();
            }
        }
    ];
    }

    checkPasswordcf() {
        if (this.modelPass.userPassword === this.modelPass.userPassCf) {
          this.confimPassword = false;
        } else {
          this.confimPassword = true;
        }
      }

    changePassword() {
        this.isShowChangePassword = true;
        this.modelPass.userLogin = '';
        this.modelPass.userPassword = '';
        this.modelPass.userPassCf = '';
    }

    saveChangePass() {
        let userLogin: any = this.authService.getClaims();
        this.submitPass = true;
        if ((this.modelPass.userPassword && !this.modelPass.userPassCf) || this.confimPassword) {
          return;
        }
        this.modelPass.userLogin = userLogin.preferred_username
        const params = { ... this.modelPass };
        delete params.userPassCf
        this.apiService.setResetPassword(params).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Sửa thông tin tài khoản thành công !' });
            this.isShowChangePassword = false;
          }
          if(results.status === 'error'){
            this.messageService.add({ severity: 'error', summary: results.message, detail: results.data });
          }
        })
    
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
