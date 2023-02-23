import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCapBacLuongComponent } from './import-cap-bac-luong.component';

describe('ImportCapBacLuongComponent', () => {
  let component: ImportCapBacLuongComponent;
  let fixture: ComponentFixture<ImportCapBacLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCapBacLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCapBacLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
