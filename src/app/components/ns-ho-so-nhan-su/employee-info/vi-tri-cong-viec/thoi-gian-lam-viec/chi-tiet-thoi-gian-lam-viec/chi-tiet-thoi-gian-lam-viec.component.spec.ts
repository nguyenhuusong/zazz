import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThoiGianLamViecComponent } from './chi-tiet-thoi-gian-lam-viec.component';

describe('ChiTietThoiGianLamViecComponent', () => {
  let component: ChiTietThoiGianLamViecComponent;
  let fixture: ComponentFixture<ChiTietThoiGianLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThoiGianLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThoiGianLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
