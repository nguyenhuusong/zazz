import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChuyenVienTinhLuongComponent } from './chi-tiet-chuyen-vien-tinh-luong.component';

describe('ChiTietChuyenVienTinhLuongComponent', () => {
  let component: ChiTietChuyenVienTinhLuongComponent;
  let fixture: ComponentFixture<ChiTietChuyenVienTinhLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChuyenVienTinhLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChuyenVienTinhLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
