import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportReasonComponent } from './import-reason.component';

describe('ImportReasonComponent', () => {
  let component: ImportReasonComponent;
  let fixture: ComponentFixture<ImportReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
