import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
const queryString = require('query-string');

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
    chooseOrga = false
    confimPassword = false;
    submitPass = false;
    organizeRole = null;
    listmenuChecks = []
    menuItems: any[] = [];
    urlsForDisableOrgan = []
    isShowPass = false;
    isShowRepass = false
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private apiService: ApiService,
        private apiHrm: ApiHrmService,
        private messageService: MessageService,
        private organizeInfoService: OrganizeInfoService,
        private changeDetector: ChangeDetectorRef,
        // private themeService: ThemeService
    ) {
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationStart) {
          this.checkDisableOrgan(val.url);
      }
      this.checkDisableOrgan(this.router.url);
    });
        this.items = [
        {
            label: 'Thay đổi mật khẩu',
            icon: 'pi pi-user-edit',
            command: () => {
                this.changePassword();
            }
        },
        {
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
        localStorage.removeItem('organizes');
    }

    ngOnInit() {
        this.userName = this.authService.getUserName();
        this.getOragin();
    }

    update() {

    }

    delete() {

    }

    // changeTheme(theme: string) {
    //     this.themeService.switchTheme(theme);
    // }

    detailOrganizes = []
    getOragin(){
      this.detailOrganizes = [];
      this.organizeRole = null;
      this.apiHrm.getUserOrganizeRole().subscribe(
        (results: any) => {
          if(results.status === "success"){
            if(results.data && results.data && results.data.length > 0){
              console.log('this.detailOrganize', this.detailOrganizes)
              this.detailOrganizes = results.data
                .map(d => {
                  return {
                    label: d.ord_name,
                    value: d.ord_id
                  };
                });
                let organizesStorage = localStorage.getItem("organizes")
                if(organizesStorage === "null" || organizesStorage === null){
                  this.organizeRole = this.detailOrganizes[0].value;
                  localStorage.setItem('organizes', this.organizeRole);
                  this.organizeInfoService.setStocks(this.organizeRole);
                }else{
                  this.organizeRole = organizesStorage;
                  this.organizeInfoService.setStocks(this.organizeRole);
                  this.changeDetector.detectChanges();
                }

            }
          }
        }),
        error => { };
    }

    ngAfterViewChecked(): void {
   
    }

    goToHome() {
      this.router.navigate(['/home']);
      // const pathname = window.location.pathname;
      //   let pathUrl = pathname.split("/");
      //   let pathUrl1 = '/';
      //   pathUrl1 = pathUrl1.concat(pathUrl["1"])
      //   if(pathUrl[2]){
      //       pathUrl1 = pathUrl1.concat("/").concat(pathUrl["2"])
      //   }
      //   this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
      //       if(results && results.length>0){
      //        const queryParams = queryString.stringify({ organizeIds: results });
      //         this.apiService.getUserMenus(queryParams).subscribe(results => {
      //              if (results.status === 'success') {
      //                  this.menuItems = results.data;
      //                  this.convetArry(this.menuItems);
      //                   if(this.listmenuChecks.map(d => d.path).indexOf(pathUrl1) < 0) {
      //                       this.router.navigate(['/404']);
      //                   }else{
      //                     // this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không có quyền truy cập' });
      //                     this.router.navigate(['/home']);
      //                   }
      //                  this.menuItems = [...this.menuItems];
      //              }
      //          });
      //       }else{
      //           this.router.navigate(['/404']);
      //       }
      //   });
        
    }

    convetArry(datas) {
      for(let item of datas) {
          this.listmenuChecks.push(item);
          if(item.submenus.length > 0) {
              this.convetArry(item.submenus);
          }
      }
  }

    changeOragi(e){
      this.organizeRole = e.value;
      this.organizeInfoService.setStocks(e.value);
      localStorage.setItem('organizes', e.value);
    }

    checkDisableOrgan(currentUrl) {
      this.urlsForDisableOrgan = [
        '/tuyen-dung/ds-tuyen-dung/them-moi-tuyen-dung',
        '/tuyen-dung/ds-tuyen-dung/chi-tiet-tuyen-dung',
        '/tuyen-dung/vi-tri-tuyen-dung/them-moi-vi-tri-tuyen-dung',
        '/tuyen-dung/vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung',
        '/tuyen-dung/chuyen-mon/them-moi-linh-vuc-tuyen-dung',
        '/tuyen-dung/chuyen-mon/chi-tiet-linh-vuc-tuyen-dung',
        '/nhan-su/ho-so-nhan-su/chi-tiet-ho-so-nhan-su',
        '/nhan-su/xu-ly-hop-dong/chi-tiet-xu-ly-hop-dong',
        '/nhan-su/ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec',
        '/nhan-su/phe-duyet/chi-tiet-phe-duyet',
        '/nhan-su/thai-san/them-moi-thai-san',
        '/nhan-su/thai-san/chi-tiet-thai-san',
        '/chinh-sach/an-ca/chi-tiet-danh-sach-an-ca',
        '/chinh-sach/phep-bu/them-moi-phep-bu',
        '/chinh-sach/phep-bu/chi-tiet-phep-bu',
        '/chinh-sach/thue-thu-nhap/chi-tiet-thue-thu-nhap',
        '/chinh-sach/cham-cong/chi-tiet-cham-cong',
        '/chinh-sach/tien-luong/chi-tiet-tien-luong',
        '/cai-dat/thong-bao/chi-tiet-thong-bao',
        '/cai-dat/cai-dat-lich-hop/them-moi-lich-hop',
        '/cai-dat/cai-dat-lich-hop/chi-tiet-lich-hop',
        '/hoat-dong/lich-hop/danh-sach-phong-hop/them-moi-phong-hop',
        '/hoat-dong/lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop',
        '/gop-y/chi-tiet-gop-y',
        '/phan-quyen/the-nhan-vien/them-moi-the-nhan-vien',
        '/cai-dat/lich-lam-viec/them-moi-lich-lam-viec',
        '/cai-dat/lich-lam-viec/chi-tiet-lich-lam-viec',
        '/cai-dat/tham-so-chung/',
        '/cai-dat/cai-dat-to-chuc/chi-tiet-to-chuc',
        '/cai-dat/cai-dat-ngay-nghi-le/them-moi-ngay-nghi',
        '/cai-dat/cai-dat-ngay-nghi-le/chi-tiet-ngay-nghi',
         '/cai-dat/chuc-vu/chi-tiet-chuc-vu',
        '/cai-dat/chuc-vu/them-moi-chuc-vu',
        '/cai-dat/noi-lam-viec/them-moi-noi-lam-viec',
        '/cai-dat/noi-lam-viec/chi-tiet-noi-lam-viec',
        '/cai-dat/ly-do-nghi/them-moi-ly-do-nghi',
        '/cai-dat/ly-do-nghi/chi-tiet-ly-do-nghi',
        '/cai-dat/cai-dat-cong-ty/them-moi-cong-ty',
        '/cai-dat/cai-dat-cong-ty/chi-tiet-cong-ty',
        '/cai-dat/quan-ly-hop-dong/them-moi-hop-dong',
        '/cai-dat/quan-ly-hop-dong/chi-tiet-hop-dong',
        '/cai-dat/thiet-lap-wifi/them-moi',
        '/cai-dat/thiet-lap-wifi/chi-tiet',
        '/chinh-sach/an-ca/chi-tiet-an-ca'
      ]
    let url = currentUrl.split('?');
    this.chooseOrga = this.urlsForDisableOrgan.some( d => d === url[0])
  }
}
