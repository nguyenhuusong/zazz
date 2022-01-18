import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLichLamViecComponent } from './chi-tiet-lich-lam-viec.component';

describe('ChiTietLichLamViecComponent', () => {
  let component: ChiTietLichLamViecComponent;
  let fixture: ComponentFixture<ChiTietLichLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLichLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLichLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
