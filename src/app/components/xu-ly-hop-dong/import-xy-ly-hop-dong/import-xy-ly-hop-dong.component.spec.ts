import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXyLyHopDongComponent } from './import-xy-ly-hop-dong.component';

describe('ImportXyLyHopDongComponent', () => {
  let component: ImportXyLyHopDongComponent;
  let fixture: ComponentFixture<ImportXyLyHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportXyLyHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportXyLyHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
