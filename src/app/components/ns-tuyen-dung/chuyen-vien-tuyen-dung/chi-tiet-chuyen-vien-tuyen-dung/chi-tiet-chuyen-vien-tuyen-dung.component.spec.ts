import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChuyenVienTuyenDungComponent } from './chi-tiet-chuyen-vien-tuyen-dung.component';

describe('ChiTietChuyenVienTuyenDungComponent', () => {
  let component: ChiTietChuyenVienTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietChuyenVienTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChuyenVienTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChuyenVienTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
