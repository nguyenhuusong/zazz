import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPricePlanComponent } from './supplier-price-plan.component';

describe('SupplierPricePlanComponent', () => {
  let component: SupplierPricePlanComponent;
  let fixture: ComponentFixture<SupplierPricePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPricePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
