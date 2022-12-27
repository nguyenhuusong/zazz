import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLyDoNghiViecComponent } from './chi-tiet-ly-do-nghi-viec.component';

describe('ChiTietLyDoNghiViecComponent', () => {
  let component: ChiTietLyDoNghiViecComponent;
  let fixture: ComponentFixture<ChiTietLyDoNghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLyDoNghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLyDoNghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
