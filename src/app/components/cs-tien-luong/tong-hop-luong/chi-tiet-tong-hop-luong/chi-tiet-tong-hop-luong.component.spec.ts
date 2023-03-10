import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTongHopLuongComponent } from './chi-tiet-tong-hop-luong.component';

describe('ChiTietTongHopLuongComponent', () => {
  let component: ChiTietTongHopLuongComponent;
  let fixture: ComponentFixture<ChiTietTongHopLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTongHopLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTongHopLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
