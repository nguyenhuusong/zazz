import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chon-thoi-gian',
  templateUrl: './chon-thoi-gian.component.html',
  styleUrls: ['./chon-thoi-gian.component.scss']
})
export class ChonThoiGianComponent implements OnInit {
  private readonly unsubscribe$: Subject<void> = new Subject();
  @Output() chooseTime = new EventEmitter<any>();
  @Input() forTime = {
    roomId: '',
    floorNo: '',
    meet_at: '',
    filter: ''
  };
  startTime = null
  endTime = null
  submitted = false;
  paramsObject;
  meet_ud = '';
  chooseTimeForm: FormGroup = new FormGroup({
    startDate: new FormControl(new Date(), [Validators.required]),
    startTime: new FormControl(new Date(), [Validators.required]),
    endTime: new FormControl(new Date(), [Validators.required]),
    meet_time: new FormControl(10, [Validators.required]),
  });

  get f(): any { return this.chooseTimeForm.controls; }
  
  get chooseTimeFormControl() {
    return this.chooseTimeForm.controls;
  }

  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    ) { }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    this.handleParams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
  }

  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.meet_ud = this.paramsObject.params.meet_ud || null;
      });
  };
  
  handleSave(): void {
    this.submitted = true;
    if (this.chooseTimeForm.invalid) {
      return;
    }
    // this.chooseTime.emit({
    //   startDate: value.startDate,
      // startTime: `${value.startTime.getHours()}:${value.startTime.getMinutes()}`,
    //   startTime: value.startTime,
    //   endTime: `${value.endTime.getHours()}:${value.endTime.getMinutes()}`
    // });

    // this.startTime = `${value.startTime.getHours()}:${value.startTime.getMinutes()}`
    // this.endTime = `${value.startTime.getHours()}:${value.startTime.getMinutes()}`
    this.getTime();
  }

  getTime() {
    const value = this.chooseTimeForm.value;
    const queryParam = {
      meet_ud: this.meet_ud || null,
      roomId: this.forTime.roomId,
      meet_at: moment(value.startDate).format("YYYY-MM-DD"),
      meet_start: `${value.startTime.getHours()}:${(value.startTime.getMinutes()< 10 ?'0' :'') + value.startTime.getMinutes()}`,
      meet_time:  value.meet_time
    }
    this.apiService.checkTimeHrm(queryParam).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
        this.chooseTime.emit(queryParam);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Thông báo', detail: 'Thao tác thất bại'});
    });
  }

  cancle() {
    this.chooseTime.emit(false);
  }
}
