import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinNguoiPhuThuocComponent } from './thong-tin-nguoi-phu-thuoc.component';

describe('ThongTinNguoiPhuThuocComponent', () => {
  let component: ThongTinNguoiPhuThuocComponent;
  let fixture: ComponentFixture<ThongTinNguoiPhuThuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinNguoiPhuThuocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinNguoiPhuThuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
