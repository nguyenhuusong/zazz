import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNgayNghiComponent } from './chi-tiet-ngay-nghi.component';

describe('ChiTietNgayNghiComponent', () => {
  let component: ChiTietNgayNghiComponent;
  let fixture: ComponentFixture<ChiTietNgayNghiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNgayNghiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNgayNghiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
