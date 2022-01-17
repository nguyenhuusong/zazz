import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietHoSoNhanSuComponent } from './chi-tiet-ho-so-nhan-su.component';

describe('ChiTietHoSoNhanSuComponent', () => {
  let component: ChiTietHoSoNhanSuComponent;
  let fixture: ComponentFixture<ChiTietHoSoNhanSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietHoSoNhanSuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietHoSoNhanSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
