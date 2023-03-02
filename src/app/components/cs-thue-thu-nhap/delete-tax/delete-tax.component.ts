import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as queryString from 'querystring';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-tax',
  templateUrl: './delete-tax.component.html',
  styleUrls: ['./delete-tax.component.css']
})
export class DeleteTaxComponent implements OnInit {
  @Output() reloadData = new EventEmitter<any>();
  @Input() companies = [];
  datereport = null;
  loading = false;
  companyId = '';
  constructor(
    private apiService: ApiHrmService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
  }

  handleSave(): void {
    if (!this.companyId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo', detail: 'Vui lòng chọn công ty'
      });
      return;
    }
    if (!this.datereport) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo', detail: 'Vui lòng chọn ngày'
      });
      return;
    }
    const date = moment(this.datereport).format('DD/MM/YYYY');
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tất cả thuế thu nhập của công ty không?',
      accept: () => {
        this.apiService.deleteReportIncomeTaxs(queryString.stringify({datereport: date, companyId: this.companyId}))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if (response.status === 'success') {
            this.messageService.add({
              severity: 'success', summary: 'Thông báo', detail: 'Xóa thành công'
            });
            this.reloadData.emit();
          } else {
            this.messageService.add({
              severity: 'error', summary: 'Thông báo', detail: response.message || 'Xóa thất bại'
            });
          }
        }, error => {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: 'Xóa thất bại'
          });
        });
      }
    });
  }
}
