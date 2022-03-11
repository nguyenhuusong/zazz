import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTheNhanVienComponent } from './chi-tiet-the-nhan-vien.component';

describe('ChiTietTheNhanVienComponent', () => {
  let component: ChiTietTheNhanVienComponent;
  let fixture: ComponentFixture<ChiTietTheNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTheNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTheNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
