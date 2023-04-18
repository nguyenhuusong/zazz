import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsNguoiPhuThuocComponent } from './ds-nguoi-phu-thuoc.component';

describe('DsNguoiPhuThuocComponent', () => {
  let component: DsNguoiPhuThuocComponent;
  let fixture: ComponentFixture<DsNguoiPhuThuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsNguoiPhuThuocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsNguoiPhuThuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
