import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChucDanhComponent } from './chi-tiet-chuc-danh.component';

describe('ChiTietChucDanhComponent', () => {
  let component: ChiTietChucDanhComponent;
  let fixture: ComponentFixture<ChiTietChucDanhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChucDanhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChucDanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
