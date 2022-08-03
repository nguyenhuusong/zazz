import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXeNhanVienComponent } from './import-xe-nhan-vien.component';

describe('ImportXeNhanVienComponent', () => {
  let component: ImportXeNhanVienComponent;
  let fixture: ComponentFixture<ImportXeNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportXeNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportXeNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
