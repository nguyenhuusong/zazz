import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTabCapBacLuongComponent } from './chi-tiet-tab-cap-bac-luong.component';

describe('ChiTietTabCapBacLuongComponent', () => {
  let component: ChiTietTabCapBacLuongComponent;
  let fixture: ComponentFixture<ChiTietTabCapBacLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTabCapBacLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTabCapBacLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
