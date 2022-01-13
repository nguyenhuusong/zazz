import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  storeId:string;
  onGetData = new EventEmitter();
  public show = true;
  constructor() { }

  showNavbar() {
    this.show = true;
  }

  hideNavbar() {
    this.show = false;
  }
  getData(){
    this.onGetData.emit(this.storeId);
  }
}
