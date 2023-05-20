import { MessageService } from 'primeng/api';
import { concatMap, debounceTime, delay, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import queryString from 'query-string';
import { concat, of, Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  cardForm: FormGroup;
  vehicleForm: FormGroup;
  results: string[];
  @Input() employeeId
  submitted = false;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getOrganize();
    this.initForm();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initForm(): void {
    this.cardForm = new FormGroup({
      employeeId: new FormControl(this.employeeId, [Validators.required]),
      orgId: new FormControl(null, [Validators.required]),
      cardName: new FormControl('Thẻ S-Service'),
      cardCd: new FormControl('', [Validators.required]),
      issueDate: new FormControl(''),
      expireDate: new FormControl(''),
      cardTypeId: new FormControl(0),
      isVip: new FormControl(true),
      isCardVehicle: new FormControl(false),
    });

    this.vehicleForm = new FormGroup({
      cardVehicleId: new FormControl(0),
      vehicleTypeId: new FormControl(1),
      vehicleNo: new FormControl(''),
      vehicleName: new FormControl(''),
      serviceId: new FormControl(''),
      startTime: new FormControl(new Date()),
      endTime: new FormControl(new Date(2030, 1, 1)),
      endTimeType: new FormControl(false),
      status: new FormControl(''),
      custId: new FormControl(0)
    });
  }

  handleShowCardVehicle(event): void {
    if (this.cardForm.value.isCardVehicle) {
      this.vehicleForm.controls['vehicleNo'].setValidators([Validators.required]);
      this.vehicleForm.controls['vehicleName'].setValidators([Validators.required]);
    } else {
      this.vehicleForm.controls['vehicleNo'].clearValidators();
      this.vehicleForm.controls['vehicleName'].clearValidators();
    }
  }

  search(event): void {
    if(this.cardForm.value.orgId === null) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chọn tổ chức' });
      return;
    }
    this.apiService.getEmployeeSearch(
      queryString.stringify({ filter: event.query, orgId: this.cardForm.value.orgId })
    )
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(t => of(t))
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.results = res.data.map(item => ({
          name: item.fullName + '-' + item.phone || item.employeeName + '-' + item.phone, code: item.code,empId: item.empId, custId: item.custId, phone: item.phone, email: item.email , departmentName:item.departmentName 
        }));
      });
  }

  handleSave(): void {
    this.submitted = true;
    if (!this.cardForm.valid || !this.vehicleForm.valid) {
      return;
    }
    const cardFormValue = { ...this.cardForm.value };
    const vehicleFormValue = { ...this.vehicleForm.value };
    let custId = '';
    if (typeof cardFormValue.employeeId !== 'string') {
      custId = cardFormValue.employeeId.custId;
      cardFormValue.employeeId = cardFormValue.employeeId.empId;
    }

    if (cardFormValue.isCardVehicle) {
      this.apiService.setCardVip(cardFormValue.cardCd, cardFormValue.employeeId, cardFormValue.cardName)
        .pipe(
          concatMap(response => {
            return this.apiService.setCardVehicle(
              vehicleFormValue.cardVehicleId, cardFormValue.cardCd, vehicleFormValue.vehicleTypeId, vehicleFormValue.vehicleNo, null,
              vehicleFormValue.vehicleName, this.dateToString(vehicleFormValue.startTime), this.dateToString(vehicleFormValue.endTime), null, custId)
          })
        ).subscribe((response: any) => {
          if (response.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới thẻ thành công' });
            this.save.emit();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Thêm mới thẻ thất bại' });
        })
    } else {
      this.apiService.setCardVip(cardFormValue.cardCd, cardFormValue.employeeId, cardFormValue.cardName)
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe((response: any) => {
          if (response.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm mới thẻ thành công' });
            this.save.emit();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Thêm mới thẻ thất bại' });
        });
    }
  }

  dateToString(date): string {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    const datestring = dd + '/' + mm + '/' + yyyy;
    return datestring;
  }

  handleChange(event): void {
    if (this.vehicleForm.value.endTimeType) {

    }
  }

  organizes = [];
  getOrganize(): void {
    this.apiService.getOrgRoots()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.organizes = results.data
          .map(d => {
            return {
              label: d.org_name,
              value: d.orgId
            };
          });
      },
      error => { });
  }


}
