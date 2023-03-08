import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietBiWifiChamCongComponent } from './thiet-bi-wifi-cham-cong.component';

describe('ThietBiWifiChamCongComponent', () => {
  let component: ThietBiWifiChamCongComponent;
  let fixture: ComponentFixture<ThietBiWifiChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietBiWifiChamCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietBiWifiChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
