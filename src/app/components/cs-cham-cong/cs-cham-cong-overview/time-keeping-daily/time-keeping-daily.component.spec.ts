import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeKeepingDailyComponent } from './time-keeping-daily.component';

describe('TimeKeepingDailyComponent', () => {
  let component: TimeKeepingDailyComponent;
  let fixture: ComponentFixture<TimeKeepingDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeKeepingDailyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeKeepingDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
