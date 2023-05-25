import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSalaryDependentComponent } from './tab-salary-dependent.component';

describe('TabSalaryDependentComponent', () => {
  let component: TabSalaryDependentComponent;
  let fixture: ComponentFixture<TabSalaryDependentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSalaryDependentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSalaryDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
