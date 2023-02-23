import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportKeHoachComponent } from './import-ke-hoach.component';

describe('ImportKeHoachComponent', () => {
  let component: ImportKeHoachComponent;
  let fixture: ComponentFixture<ImportKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
