import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLoaiBieuMauComponent } from './chi-tiet-loai-bieu-mau.component';

describe('ChiTietLoaiBieuMauComponent', () => {
  let component: ChiTietLoaiBieuMauComponent;
  let fixture: ComponentFixture<ChiTietLoaiBieuMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLoaiBieuMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLoaiBieuMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
