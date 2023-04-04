import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs'
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class EmployeeSaveService {
  private readonly _employeeServiceInfo = new BehaviorSubject<any>(null);

  readonly employeeServiceInfo$ = this._employeeServiceInfo.asObservable();

  constructor(private apiService: ApiService) {
  }

  set employeeServiceInfo(val: any) {
    if (val) {
      this._employeeServiceInfo.next(val);
    } else {
      this._employeeServiceInfo.next(null);
    }
  }

  get employeeServiceInfo(): any {
    return this._employeeServiceInfo.getValue();
  }

  setStocks(value) {
    this.employeeServiceInfo = value
  }

  fetchAll() {
    return of(this._employeeServiceInfo.getValue())
  }
  
}