import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietAnCaComponent } from './chi-tiet-an-ca.component';

describe('ChiTietAnCaComponent', () => {
  let component: ChiTietAnCaComponent;
  let fixture: ComponentFixture<ChiTietAnCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietAnCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietAnCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
