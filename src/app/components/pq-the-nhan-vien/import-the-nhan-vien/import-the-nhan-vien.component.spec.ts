import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTheNhanVienComponent } from './import-the-nhan-vien.component';

describe('ImportTheNhanVienComponent', () => {
  let component: ImportTheNhanVienComponent;
  let fixture: ComponentFixture<ImportTheNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTheNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTheNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
