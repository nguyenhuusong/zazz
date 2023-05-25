import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSalaryInsuranceComponent } from './tab-salary-insurance.component';

describe('TabSalaryInsuranceComponent', () => {
  let component: TabSalaryInsuranceComponent;
  let fixture: ComponentFixture<TabSalaryInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSalaryInsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSalaryInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
