import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyNgayNghiComponent } from './quan-ly-ngay-nghi.component';

describe('QuanLyNgayNghiComponent', () => {
  let component: QuanLyNgayNghiComponent;
  let fixture: ComponentFixture<QuanLyNgayNghiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyNgayNghiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanLyNgayNghiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
