import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsChiTietLuongComponent } from './ds-chi-tiet-luong.component';

describe('DsChiTietLuongComponent', () => {
  let component: DsChiTietLuongComponent;
  let fixture: ComponentFixture<DsChiTietLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsChiTietLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsChiTietLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
