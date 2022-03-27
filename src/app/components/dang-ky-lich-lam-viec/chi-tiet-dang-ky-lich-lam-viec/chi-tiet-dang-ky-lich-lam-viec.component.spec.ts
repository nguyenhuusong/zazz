import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietDangKyLichLamViecComponent } from './chi-tiet-dang-ky-lich-lam-viec.component';

describe('ChiTietDangKyLichLamViecComponent', () => {
  let component: ChiTietDangKyLichLamViecComponent;
  let fixture: ComponentFixture<ChiTietDangKyLichLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietDangKyLichLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietDangKyLichLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
