import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThietLapWifiComponent } from './chi-tiet-thiet-lap-wifi.component';

describe('ChiTietThietLapWifiComponent', () => {
  let component: ChiTietThietLapWifiComponent;
  let fixture: ComponentFixture<ChiTietThietLapWifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThietLapWifiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThietLapWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
