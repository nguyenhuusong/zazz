import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietMauThongBaoComponent } from './chi-tiet-mau-thong-bao.component';

describe('ChiTietMauThongBaoComponent', () => {
  let component: ChiTietMauThongBaoComponent;
  let fixture: ComponentFixture<ChiTietMauThongBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietMauThongBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietMauThongBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
