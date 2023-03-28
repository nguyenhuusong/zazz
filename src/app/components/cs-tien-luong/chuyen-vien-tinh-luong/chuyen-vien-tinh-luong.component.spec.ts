import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyenVienTinhLuongComponent } from './chuyen-vien-tinh-luong.component';

describe('ChuyenVienTinhLuongComponent', () => {
  let component: ChuyenVienTinhLuongComponent;
  let fixture: ComponentFixture<ChuyenVienTinhLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChuyenVienTinhLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyenVienTinhLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
