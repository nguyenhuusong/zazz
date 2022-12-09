import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachDinhKemComponent } from './danh-sach-dinh-kem.component';

describe('DanhSachDinhKemComponent', () => {
  let component: DanhSachDinhKemComponent;
  let fixture: ComponentFixture<DanhSachDinhKemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachDinhKemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachDinhKemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
