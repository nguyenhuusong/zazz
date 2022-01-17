import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietHoSoNghiViecComponent } from './chi-tiet-ho-so-nghi-viec.component';

describe('ChiTietHoSoNghiViecComponent', () => {
  let component: ChiTietHoSoNghiViecComponent;
  let fixture: ComponentFixture<ChiTietHoSoNghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietHoSoNghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietHoSoNghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
