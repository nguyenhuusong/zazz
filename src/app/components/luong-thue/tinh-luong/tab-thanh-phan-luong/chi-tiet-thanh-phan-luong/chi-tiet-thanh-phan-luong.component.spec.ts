import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThanhPhanLuongComponent } from './chi-tiet-thanh-phan-luong.component';

describe('ChiTietThanhPhanLuongComponent', () => {
  let component: ChiTietThanhPhanLuongComponent;
  let fixture: ComponentFixture<ChiTietThanhPhanLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThanhPhanLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThanhPhanLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
