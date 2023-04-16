import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCustomerManagerComponent } from './detail-customer-manager.component';

describe('DetailCustomerManagerComponent', () => {
  let component: DetailCustomerManagerComponent;
  let fixture: ComponentFixture<DetailCustomerManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCustomerManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCustomerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
