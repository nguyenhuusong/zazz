import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetNotifyToComponent } from './get-notify-to.component';

describe('GetNotifyToComponent', () => {
  let component: GetNotifyToComponent;
  let fixture: ComponentFixture<GetNotifyToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetNotifyToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetNotifyToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
