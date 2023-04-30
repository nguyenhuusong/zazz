import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNghiKhongLuongComponent } from './chi-tiet-nghi-khong-luong.component';

describe('ChiTietNghiKhongLuongComponent', () => {
  let component: ChiTietNghiKhongLuongComponent;
  let fixture: ComponentFixture<ChiTietNghiKhongLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNghiKhongLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNghiKhongLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
