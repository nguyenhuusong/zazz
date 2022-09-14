import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chon-thoi-gian',
  templateUrl: './chon-thoi-gian.component.html',
  styleUrls: ['./chon-thoi-gian.component.scss']
})
export class ChonThoiGianComponent implements OnInit {
  @Output() chooseTime = new EventEmitter<any>();
  submitted = false;
  chooseTimeForm: FormGroup = new FormGroup({
    startDate: new FormControl(new Date(), [Validators.required]),
    startTime: new FormControl(new Date(), [Validators.required]),
    endTime: new FormControl(new Date(), [Validators.required]),
  });

  get f(): any { return this.chooseTimeForm.controls; }
  
  get chooseTimeFormControl() {
    return this.chooseTimeForm.controls;
  }

  constructor() { }

  ngOnInit(): void {
  }

  
  handleSave(): void {
    this.submitted = true;
    if (this.chooseTimeForm.invalid) {
      return;
    }
    const value = this.chooseTimeForm.value;
    this.chooseTime.emit({
      startDate: value.startDate,
      startTime: `${value.startTime.getHours()}:${value.startTime.getMinutes()}`,
      endTime: `${value.endTime.getHours()}:${value.endTime.getMinutes()}`
    });
  }
}
