import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLoaiThongBaoComponent } from './chi-tiet-loai-thong-bao.component';

describe('ChiTietLoaiThongBaoComponent', () => {
  let component: ChiTietLoaiThongBaoComponent;
  let fixture: ComponentFixture<ChiTietLoaiThongBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLoaiThongBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLoaiThongBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
