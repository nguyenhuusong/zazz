import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChinhSachLuongComponent } from './chi-tiet-chinh-sach-luong.component';

describe('ChiTietChinhSachLuongComponent', () => {
  let component: ChiTietChinhSachLuongComponent;
  let fixture: ComponentFixture<ChiTietChinhSachLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChinhSachLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChinhSachLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
