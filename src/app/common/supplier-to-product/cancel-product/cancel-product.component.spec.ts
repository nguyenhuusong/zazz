import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelProductComponent } from './cancel-product.component';

describe('CancelProductComponent', () => {
  let component: CancelProductComponent;
  let fixture: ComponentFixture<CancelProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
