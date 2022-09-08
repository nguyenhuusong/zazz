import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietBangLuongComponent } from './chi-tiet-bang-luong.component';

describe('ChiTietBangLuongComponent', () => {
  let component: ChiTietBangLuongComponent;
  let fixture: ComponentFixture<ChiTietBangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietBangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietBangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
