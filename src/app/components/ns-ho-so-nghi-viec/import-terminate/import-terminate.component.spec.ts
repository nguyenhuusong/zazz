import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTerminateComponent } from './import-terminate.component';

describe('ImportTerminateComponent', () => {
  let component: ImportTerminateComponent;
  let fixture: ComponentFixture<ImportTerminateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTerminateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTerminateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
