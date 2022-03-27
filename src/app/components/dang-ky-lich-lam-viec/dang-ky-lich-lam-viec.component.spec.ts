import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangKyLichLamViecComponent } from './dang-ky-lich-lam-viec.component';

describe('DangKyLichLamViecComponent', () => {
  let component: DangKyLichLamViecComponent;
  let fixture: ComponentFixture<DangKyLichLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DangKyLichLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DangKyLichLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
