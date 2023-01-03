import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapNhatTrangThaiNghiViecComponent } from './cap-nhat-trang-thai-nghi-viec.component';

describe('CapNhatTrangThaiNghiViecComponent', () => {
  let component: CapNhatTrangThaiNghiViecComponent;
  let fixture: ComponentFixture<CapNhatTrangThaiNghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapNhatTrangThaiNghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapNhatTrangThaiNghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
