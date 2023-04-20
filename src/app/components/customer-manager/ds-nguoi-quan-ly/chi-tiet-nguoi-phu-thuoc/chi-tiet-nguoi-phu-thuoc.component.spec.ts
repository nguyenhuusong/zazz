import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNguoiPhuThuocComponent } from './chi-tiet-nguoi-phu-thuoc.component';

describe('ChiTietNguoiPhuThuocComponent', () => {
  let component: ChiTietNguoiPhuThuocComponent;
  let fixture: ComponentFixture<ChiTietNguoiPhuThuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNguoiPhuThuocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNguoiPhuThuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
