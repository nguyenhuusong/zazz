import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs'
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrganizeInfoService {
  private readonly _organizeInfo = new BehaviorSubject<any[]>([]);

  readonly organizeInfo$ = this._organizeInfo.asObservable();

  constructor(private apiService: ApiService) {
  }

  set organizeInfo(val: any[]) {
    if (val) {
      this._organizeInfo.next(val);
    } else {
      this._organizeInfo.next(null);
    }
  }

  get organizeInfo(): any[] {
    return this._organizeInfo.getValue();
  }

  setStocks(value) {
    this.organizeInfo = value
  }

  fetchAll() {
    return of(this._organizeInfo.getValue())
  }
  
}