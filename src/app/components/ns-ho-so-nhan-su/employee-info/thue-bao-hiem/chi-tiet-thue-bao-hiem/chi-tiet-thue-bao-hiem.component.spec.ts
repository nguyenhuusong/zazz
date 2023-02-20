import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThueBaoHiemComponent } from './chi-tiet-thue-bao-hiem.component';

describe('ChiTietThueBaoHiemComponent', () => {
  let component: ChiTietThueBaoHiemComponent;
  let fixture: ComponentFixture<ChiTietThueBaoHiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThueBaoHiemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThueBaoHiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
