import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAnnualByEmpIdComponent } from './leave-annual-by-emp-id.component';

describe('LeaveAnnualByEmpIdComponent', () => {
  let component: LeaveAnnualByEmpIdComponent;
  let fixture: ComponentFixture<LeaveAnnualByEmpIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveAnnualByEmpIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAnnualByEmpIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
