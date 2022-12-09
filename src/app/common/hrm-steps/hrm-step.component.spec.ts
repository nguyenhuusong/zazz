import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HrmStepComponent } from './hrm-step.component';

describe('HrmStepComponent', () => {
  let component: HrmStepComponent;
  let fixture: ComponentFixture<HrmStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
