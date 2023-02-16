import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportToChucComponent } from './import-to-chuc.component';

describe('ImportToChucComponent', () => {
  let component: ImportToChucComponent;
  let fixture: ComponentFixture<ImportToChucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportToChucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportToChucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
