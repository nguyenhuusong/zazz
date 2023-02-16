import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCongTyComponent } from './import-cong-ty.component';

describe('ImportCongTyComponent', () => {
  let component: ImportCongTyComponent;
  let fixture: ComponentFixture<ImportCongTyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCongTyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCongTyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
