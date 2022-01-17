import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThueThuNhapComponent } from './chi-tiet-thue-thu-nhap.component';

describe('ChiTietThueThuNhapComponent', () => {
  let component: ChiTietThueThuNhapComponent;
  let fixture: ComponentFixture<ChiTietThueThuNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThueThuNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThueThuNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
