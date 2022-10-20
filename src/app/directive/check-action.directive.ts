import { Directive, OnInit, ElementRef, Input, Output, AfterViewInit, SimpleChanges, HostListener, OnChanges, AfterViewChecked, AfterContentChecked, EventEmitter, NgModule } from '@angular/core';
import { UserManager } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { cloneDeep } from 'lodash'
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { OrganizeInfoService } from '../services/organize-info.service';
import * as queryString from 'querystring';
declare var $: any
@Directive({
  selector: '[CheckHideActions]',
  host: {
    '(change)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)'
  }
})
export class CheckHideActionsDirective implements OnInit, AfterViewInit, AfterContentChecked {
  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() CheckHideActions
  accountAPI = null;
  dsMenu = []
  private manager: UserManager = new UserManager(environment.authenSettings);
  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private apiService: ApiService,
    private organizeInfoService: OrganizeInfoService,
  ) {
    // this.accountAPI = this.authService.getPermissions();

  }


  ngAfterViewInit() {

  }
  ngOnInit() {
    this.el.nativeElement.hidden = true;

    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
      if(results && results.length>0){
        this.manager.getUser().then(user => {
            const query = {  }
            const queryParams = queryString.stringify({ organizeIds: results });
            this.apiService.getUserMenus(queryParams).subscribe((results: any) => {
            // this.apiService.getListMenuByUserId(this.authService.getClaims().sub, '3133579B-4FD9-449E-9CEA-4B384884E7D3').subscribe(results => {
                if (results.status === 'success') {
                    let newArray = []
                    results.data.forEach(element => {
                        newArray.push(element);
                        if (element.submenus && element.submenus.length > 0) {
                            element.submenus.forEach(element1 => {
                                newArray.push(element1);
                            });
                        }
                    });;
                    if (newArray) {
                        const menus = newArray.find(m => m.path === this.CheckHideActions.url);
                        if (menus) {
                            const arrAction = menus.actions.map(d => d.actionCd);
                            if (arrAction.indexOf(this.CheckHideActions.action) > -1) {
                                this.el.nativeElement.hidden = false;
                            } else {
                                this.el.nativeElement.hidden = true;
                            }
                        }
                    }else {
                        this.el.nativeElement.hidden = true;
                    }
                }
            })
        });
      }
    });
  }

  ngAfterContentChecked() {

  }
  onInputChange(event: any, backspace: any) {
    // if (event) {
    //     if (event.target) {
    //         let newVal = numeral(event.target.value).format('0,0');
    //         // // var myNumeral2 = numeral(newVal);
    //         // // var value2 = myNumeral2.value();
    //         var rawValue = newVal;
    //         console.log(newVal)
    //         event.target.value = newVal
    //         // this.model = newVal
    //         this.rawChange.emit(rawValue)
    //     }
    // }

  }
}
