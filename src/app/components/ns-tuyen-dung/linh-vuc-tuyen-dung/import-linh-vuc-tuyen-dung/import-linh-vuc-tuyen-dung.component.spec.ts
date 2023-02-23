import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLinhVucTuyenDungComponent } from './import-linh-vuc-tuyen-dung.component';

describe('ImportLinhVucTuyenDungComponent', () => {
  let component: ImportLinhVucTuyenDungComponent;
  let fixture: ComponentFixture<ImportLinhVucTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportLinhVucTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLinhVucTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
