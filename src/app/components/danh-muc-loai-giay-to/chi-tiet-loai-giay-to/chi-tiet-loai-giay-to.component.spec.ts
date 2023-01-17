import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLoaiGiayToComponent } from './chi-tiet-loai-giay-to.component';

describe('ChiTietLoaiGiayToComponent', () => {
  let component: ChiTietLoaiGiayToComponent;
  let fixture: ComponentFixture<ChiTietLoaiGiayToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLoaiGiayToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLoaiGiayToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
