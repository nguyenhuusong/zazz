import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPhepBuComponent } from './import-phep-bu.component';

describe('ImportPhepBuComponent', () => {
  let component: ImportPhepBuComponent;
  let fixture: ComponentFixture<ImportPhepBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPhepBuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPhepBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
