import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as firebase from 'firebase';
import { ApiService } from 'src/app/services/api.service';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent implements OnInit, OnChanges {
  manhinh = 'View';
  
  optionsButtonsView = [ { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  }];
  constructor(
    private apiService: ApiService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  listViews = []
  @Input() thongtinchitietthe = null
  @Input() isAddCustomer = false
  @Output() back = new EventEmitter<any>();
  detailInfo = null;
  ngOnChanges(event) {
    if (event) {
      this.optionsButtonsView = [ { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check'  }];
      this.manhinh = 'Edit'
      this.getCustIndiIdentity();
    }
  }

  ngOnInit(): void {

  }

  getCustIndiIdentity() {
    this.listViews = [];
    this.listViews = cloneDeep(this.thongtinchitietthe.group_fields);
    // const queryParams = queryString.stringify(this.thongtinchitietthe);
    // this.apiService.getCustIndiIdentity(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.detailInfo = results.data;
    //     this.listViews = cloneDeep(results.data.group_fields);
    //   }
    // })
  }

  setAccountInfo(data) {
    const params = {
      ...this.thongtinchitietthe, group_fields: data
    };
    if (this.isAddCustomer) {
      this.back.emit(params);
    } else {
      this.apiCoreService.setCustIndiIdentity(params).subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.back.emit();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      }, error => {
      });
    }

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
    this.getCustIndiIdentity();
  }
}


