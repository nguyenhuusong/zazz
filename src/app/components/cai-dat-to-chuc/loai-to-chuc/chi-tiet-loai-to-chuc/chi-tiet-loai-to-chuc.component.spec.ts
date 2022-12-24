import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLoaiToChucComponent } from './chi-tiet-loai-to-chuc.component';

describe('ChiTietLoaiToChucComponent', () => {
  let component: ChiTietLoaiToChucComponent;
  let fixture: ComponentFixture<ChiTietLoaiToChucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLoaiToChucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLoaiToChucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
