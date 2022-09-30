import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTabBangLuongComponent } from './chi-tiet-tab-bang-luong.component';

describe('ChiTietTabBangLuongComponent', () => {
  let component: ChiTietTabBangLuongComponent;
  let fixture: ComponentFixture<ChiTietTabBangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTabBangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTabBangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
