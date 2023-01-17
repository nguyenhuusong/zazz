import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachThietBiComponent } from './danh-sach-thiet-bi.component';

describe('DanhSachThietBiComponent', () => {
  let component: DanhSachThietBiComponent;
  let fixture: ComponentFixture<DanhSachThietBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachThietBiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachThietBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
