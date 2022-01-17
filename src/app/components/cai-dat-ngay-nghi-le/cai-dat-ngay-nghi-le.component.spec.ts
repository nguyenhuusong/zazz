import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatNgayNghiLeComponent } from './cai-dat-ngay-nghi-le.component';

describe('CaiDatNgayNghiLeComponent', () => {
  let component: CaiDatNgayNghiLeComponent;
  let fixture: ComponentFixture<CaiDatNgayNghiLeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatNgayNghiLeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatNgayNghiLeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
