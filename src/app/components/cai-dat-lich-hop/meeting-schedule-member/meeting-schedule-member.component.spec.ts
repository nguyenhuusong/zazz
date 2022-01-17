import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingScheduleMemberComponent } from './meeting-schedule-member.component';

describe('MeetingScheduleMemberComponent', () => {
  let component: MeetingScheduleMemberComponent;
  let fixture: ComponentFixture<MeetingScheduleMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingScheduleMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingScheduleMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
