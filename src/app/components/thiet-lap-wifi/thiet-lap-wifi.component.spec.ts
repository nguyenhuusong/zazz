import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietLapWifiComponent } from './thiet-lap-wifi.component';

describe('ThietLapWifiComponent', () => {
  let component: ThietLapWifiComponent;
  let fixture: ComponentFixture<ThietLapWifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietLapWifiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietLapWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
