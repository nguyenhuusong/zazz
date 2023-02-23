import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportThanhPhanLuongComponent } from './import-thanh-phan-luong.component';

describe('ImportThanhPhanLuongComponent', () => {
  let component: ImportThanhPhanLuongComponent;
  let fixture: ComponentFixture<ImportThanhPhanLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportThanhPhanLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportThanhPhanLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
