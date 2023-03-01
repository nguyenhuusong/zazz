import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent implements OnInit {
  @Output() reloadData = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService
  ) { }
  date = null;
  file = null;
  loading = false;
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
  }

  handleSave(): void {
    if (!this.file) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo', detail: 'Vui lòng chọn file'
      });
      return;
    }
    if (!this.date) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo', detail: 'Vui lòng chọn ngày'
      });
      return;
    }
    const date = moment(this.date).format('MM/DD/YYYY');
    this.loading = true;
    this.apiService.setIncomTaxImport(this.file, date)
    .pipe(
      finalize(() => this.loading = false)
    )
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(response => {
      if (response.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Import file thành công' });
        this.reloadData.emit();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo', detail: response ? response.message : 'Import file bị lỗi'
        });
      }
    });
  }

  importExcel(event): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
}
