import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNghiPhepComponent } from './chi-tiet-nghi-phep.component';

describe('ChiTietNghiPhepComponent', () => {
  let component: ChiTietNghiPhepComponent;
  let fixture: ComponentFixture<ChiTietNghiPhepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNghiPhepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNghiPhepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
