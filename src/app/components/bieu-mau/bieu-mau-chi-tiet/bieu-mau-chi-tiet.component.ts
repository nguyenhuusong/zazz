import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { cloneDeep } from 'lodash';
import queryString from 'query-string';

@Component({
  selector: 'app-bieu-mau-chi-tiet',
  templateUrl: './bieu-mau-chi-tiet.component.html',
  styleUrls: ['./bieu-mau-chi-tiet.component.scss']
})
export class BieuMauChiTietComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Xác nhận', value: 'Update', class: '', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ];
  titlePage = '';
  @Input() formId: string  = null;
  @Output() callback = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getDetail();
  }

 
  getDetail() {
    this.listViews = [];
    this.detailInfo = [];
    this.spinner.show();
    const queryParams = queryString.stringify({formId: this.formId});
    this.apiService.getFormsInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.spinner.hide();
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = cloneDeep(listViews);
          this.detailInfo = results.data;
        }
      });
  }

  quaylai(data) {
   if(data === 'CauHinh') {
    this.getDetail();
   }else if(data === 'Cancel'){
    this.callback.emit('Cancel');
   }
   
  }

  handleSave(event) {
    const params = {
      ...this.detailInfo, group_fields: event
    };

    this.apiService.setFormsInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.callback.emit();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      }; 
  }
}

