import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHoSoNhanSuComponent } from './import-ho-so-nhan-su.component';

describe('ImportHoSoNhanSuComponent', () => {
  let component: ImportHoSoNhanSuComponent;
  let fixture: ComponentFixture<ImportHoSoNhanSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportHoSoNhanSuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportHoSoNhanSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
