import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { WebsocketService2 } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";

import queryString from 'query-string';

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
  isShowRepass = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webSocketService: WebsocketService2,
    private authService: AuthService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private apiHrm: ApiHrmService,
    private messageService: MessageService,

    private changeDetector: ChangeDetectorRef,
    // private themeService: ThemeService
  ) {
    if (localStorage.hasOwnProperty('DEVICE_INFO') && localStorage.getItem('DEVICE_INFO')) {
      this.detailWebSocketService = JSON.parse(localStorage.getItem('DEVICE_INFO'));
    } else {
      this.webSocketService.connect(environment.socketServer);
      this.webSocketService.emit("action", 'DEVICE_INFO')
      this.getWebSocketService();
    }
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.checkDisableOrgan(val.url);
      }
      this.checkDisableOrgan(this.router.url);
    });
  }

  detailWebSocketService = null;
  getWebSocketService() {
    this.webSocketService.myWebSocket
      .subscribe(
        repon => {
          repon = JSON.parse(repon)
          if (repon.result) {
            localStorage.setItem('DEVICE_INFO', JSON.stringify(repon.data));
            this.detailWebSocketService = repon.data;
          } else {
            this.detailWebSocketService = null;
          }

        },
        err => {
          console.log(err)
        },
      )
  }
  initMenu() {
    this.items = [
      {
        label: 'Thay đổi mật khẩu',
        icon: 'pi pi-user-edit',
        command: () => {
          this.changePassword();
        }
      },
      this.detailUserSalary && (!this.detailUserSalary.roleToken || this.detailUserSalary.roleToken == "") ?
      {
        label: 'Kích hoạt tài khoản',
        icon: 'pi pi-check',

        command: () => {
          this.activeAccount();
        }
      } : {
        label: 'Kích hoạt tài khoản',
        icon: 'pi pi-check',
        visible: false
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
      if (results.status === 'error') {
        this.messageService.add({ severity: 'error', summary: results.message, detail: results.data });
      }
    })

  }

  logout() {
    this.authService.signout();
    localStorage.removeItem('organizes');
    localStorage.removeItem('md5');
  }

  ngOnInit() {
    this.initMenu();
    this.userName = this.authService.getUserName();
    this.getUserSalary()
  
  }

  update() {

  }

  delete() {

  }

  // changeTheme(theme: string) {
  //     this.themeService.switchTheme(theme);
  // }

  detailOrganizes = []


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
    for (let item of datas) {
      this.listmenuChecks.push(item);
      if (item.submenus.length > 0) {
        this.convetArry(item.submenus);
      }
    }
  }

  changeOragi(e) {
    this.organizeRole = e.value;
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
      '/chinh-sach/an-ca/chi-tiet-an-ca',
      '/nhan-su/qua-trinh-thay-doi-luong/chi-tiet-qua-trinh-thay-doi-luong'
    ]
    let url = currentUrl.split('?');
    this.chooseOrga = this.urlsForDisableOrgan.some(d => d === url[0])
  }

  displayActive = false;
  detailUserSalary = null;
  getUserSalary() {
    const queryParams = queryString.stringify({
      systemId: this.detailWebSocketService ? this.detailWebSocketService.systemInfo.machineName : null,
      mainBoardId: this.detailWebSocketService?  this.detailWebSocketService.mainBoard.serialNumber : null,
      processorId: this.detailWebSocketService ? this.detailWebSocketService.processor.processorId : null,
    });
    this.apiHrm.getUserSalary(queryParams)
      .subscribe(results => {
        if (results.status === 'success') {
          this.detailUserSalary = results.data;
          if(this.detailUserSalary && this.detailUserSalary.valid && this.detailUserSalary.activated && this.detailUserSalary.roleToken) {
            // const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.detailUserSalary.roleToken));
            const base64 = btoa(this.detailUserSalary.roleToken)
            localStorage.setItem("md5", base64)
          }else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: this.detailUserSalary.messages });
            localStorage.removeItem("md5")
          }
           this.initMenu();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      });
    
  }

  ngOnDestroy() {
  }

  displayActiveAccount = false;
  activeAccount() {
    if (this.detailWebSocketService) {
        this.displayActiveAccount = true;
        this.modelPass.userPassword = '';
        this.modelPass.userPassCf = '';
     
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa cài đặt plugin' });
    };
  }

  saveActive() {
        var format = /^-?\d+$/;
        if ((this.modelPass.userPassword && !this.modelPass.userPassCf) || this.confimPassword) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Mật khẩu không khớp !" });
          return;
        }
        if(!format.test(this.modelPass.userPassword)){
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Nhập mật khẩu không hợp lệ !" });
          return
        }
        const params = {
        id: this.detailUserSalary.id,
        roleToken: this.modelPass.userPassword,
        reRoleToken: this.modelPass.userPassCf,
        systemId: this.detailWebSocketService.systemInfo.machineName,
        mainBoardId: this.detailWebSocketService.mainBoard.serialNumber,
        processorId: this.detailWebSocketService.processor.processorId,
        networkId: null
      }
      this.apiHrm.setUserSalaryActivate(params)
        .subscribe(results => {
          if (results.status === 'success') {
            this.modelOTP.secret_cd = results.data && results.data.secret_cd ? results.data.secret_cd : null;
            this.modelOTP.id = this.detailUserSalary.id;
            this.displayActiveAccount =false;
            this.displayActive = true;
            this.getUserSalary();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
          }
        })
  }

  handeOtpChange(value: string[]): void {
    console.log(value);
  }
  modelOTP = {
    id: null,
    code: null,
    secret_cd: null
  }
  handleFillEvent(): void {
    if (!this.modelOTP.code) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa nhập mã code' });
      return;
    }
    this.spinner.show();
    const params: any = { ...this.modelOTP }
    this.apiHrm.setUserSalaryVerify(params)
      .subscribe({
        next: async response => {
          if (response.error) {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message ? response.message : 'Kích hoạt thất bại' });
            this.displayActive = false;
            this.spinner.hide();
          } else {
            this.displayActive = false;
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message || 'Gửi OTP thành công' });
            this.spinner.hide();
          }
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Thất bại!' });
          this.displayActive = false;
          this.spinner.hide();
          console.error(err);
        }
      });
  }
}


@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
