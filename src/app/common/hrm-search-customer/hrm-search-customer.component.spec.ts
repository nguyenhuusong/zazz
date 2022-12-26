import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HrmSearchCustomerComponent } from './hrm-search-customer.component';

describe('HrmSearchCustomerComponent', () => {
  let component: HrmSearchCustomerComponent;
  let fixture: ComponentFixture<HrmSearchCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmSearchCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmSearchCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
