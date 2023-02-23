import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQtThayDoiLuongComponent } from './import-qt-thay-doi-luong.component';

describe('ImportQtThayDoiLuongComponent', () => {
  let component: ImportQtThayDoiLuongComponent;
  let fixture: ComponentFixture<ImportQtThayDoiLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportQtThayDoiLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQtThayDoiLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
