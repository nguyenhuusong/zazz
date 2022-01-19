import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChucVuComponent } from './chi-tiet-chuc-vu.component';

describe('ChiTietChucVuComponent', () => {
  let component: ChiTietChucVuComponent;
  let fixture: ComponentFixture<ChiTietChucVuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChucVuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChucVuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
