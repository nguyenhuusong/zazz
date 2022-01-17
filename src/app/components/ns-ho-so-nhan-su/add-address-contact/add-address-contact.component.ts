import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import { forkJoin } from 'rxjs';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
@Component({
  selector: 'app-add-address-contact',
  templateUrl: './add-address-contact.component.html',
  styleUrls: ['./add-address-contact.component.css']
})
export class AddAddressContactComponent implements OnInit, OnChanges {
  manhinh = 'View';
  constructor(
    private apiService: ApiService,
    private apiServiceCore: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  contAdd1s = [];
  huyens = [];
  phuongxas = [];
  tinhs = [];

  modelAddress = {
    cont_id: 0,
    cont_name: '',
    cont_phone: '',
    cont_add1: '',
    cont_add2: '',
    cont_add3: '',
    cont_add4: '',
    cont_add_full: '',
    cont_flg: false,
    custId: ''
  }
  trangthais = [ 
    {label: 'Sử dụng', value: true},
    {label: 'Không sử dụng', value: false},
  ]
  listViews = []
  @Input() thongtinlienhe = null
  @Output() back = new EventEmitter<any>();
  detailInfo = null;
  addFull = []

  ngOnChanges(event) {
    if (event) {
      if (this.thongtinlienhe.cont_id > 0) {
        const diachi1 = this.apiServiceCore.geAddressList(queryString.stringify({ parent_code: '' }))
        const diachi2 = this.apiServiceCore.geAddressList(queryString.stringify({ parent_code: this.thongtinlienhe.cont_add4 }))
        const diachi3 = this.apiServiceCore.geAddressList(queryString.stringify({ parent_code: this.thongtinlienhe.cont_add3 }))
        forkJoin([diachi1, diachi2, diachi3])
          .subscribe(results => {
            this.tinhs = results[0].data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
            this.huyens = results[1].data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
            this.phuongxas = results[2].data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
            this.modelAddress = this.thongtinlienhe;
            const add1 = this.tinhs.filter(d => d.value === this.modelAddress.cont_add4);
            this.addFull = this.addFull.filter(s => s !== add1[0].label);
            this.addFull.unshift(add1[0].label);

            const add2 = this.huyens.filter(d => d.value === this.modelAddress.cont_add3);
            this.addFull = this.addFull.filter(s => s !== add2[0].label);
            this.addFull.unshift(add2[0].label);

            const add3 = this.phuongxas.filter(d => d.value === this.modelAddress.cont_add2);
            this.addFull = this.addFull.filter(s => s !== add3[0].label);
            this.addFull.unshift(add3[0].label);

          })
      } else {
        this.modelAddress.custId = this.thongtinlienhe.custId
      }
      this.geAddressList('tinh', '')
    }
  }

  ngOnInit(): void {

  }

  geAddressList(type, parent_code) {
    const queryParams = queryString.stringify({ parent_code: parent_code });
    this.apiServiceCore.geAddressList(queryParams)
      .subscribe(results => {
        if (results.status === 'success') {
          if (type === 'tinh') {
            this.tinhs = results.data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
          } else if (type === 'huyen') {
            this.huyens = results.data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
          } else if (type === 'phuongxa') {
            this.phuongxas = results.data.map(d => {
              return {
                label: d.name,
                value: d.code
              }
            });
          }

        }
      })
  }

  getHuyen() {
    const tinhs = this.tinhs.filter(d => d.value === this.modelAddress.cont_add4);
    this.addFull = this.addFull.filter(s => s !== tinhs[0].label);
    this.addFull.unshift(tinhs[0].label);
    this.modelAddress.cont_add_full = this.addFull.toString();
    this.geAddressList('huyen', this.modelAddress.cont_add4);
  }

  getphuongxa() {
    const huyens = this.huyens.filter(d => d.value === this.modelAddress.cont_add3);
    this.addFull = this.addFull.filter(s => s !== huyens[0].label);
    this.addFull.unshift(huyens[0].label);
    this.modelAddress.cont_add_full = this.addFull.toString();
    this.geAddressList('phuongxa', this.modelAddress.cont_add3);
  }


  getContAddress1() {
    const phuongxas = this.phuongxas.filter(d => d.value === this.modelAddress.cont_add2);
    this.addFull = this.addFull.filter(s => s !== phuongxas[0].label);
    this.addFull.unshift(phuongxas[0].label);
    this.modelAddress.cont_add_full = this.addFull.toString();
  }

  fullStringAddress() {
    if (this.modelAddress.cont_add1) {
      this.modelAddress.cont_add_full = this.modelAddress.cont_add1 + ', ' + this.addFull.toString() ;
    } else {
      this.modelAddress.cont_add_full = this.addFull.toString();
    }
  }

  saveAddress() {
    const params = { ...this.modelAddress };
    this.apiServiceCore.setCustAddressContact(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.back.emit();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    }, error => {
    });
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
    this.back.emit();
  }

  cancelUpdate() {
    this.manhinh = 'Edit';
  }
}


