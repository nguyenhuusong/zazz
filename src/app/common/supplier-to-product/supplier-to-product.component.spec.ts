import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierToProductComponent } from './supplier-to-product.component';

describe('SupplierToProductComponent', () => {
  let component: SupplierToProductComponent;
  let fixture: ComponentFixture<SupplierToProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierToProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierToProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
