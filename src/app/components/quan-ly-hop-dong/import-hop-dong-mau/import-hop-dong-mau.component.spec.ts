import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHopDongMauComponent } from './import-hop-dong-mau.component';

describe('ImportHopDongMauComponent', () => {
  let component: ImportHopDongMauComponent;
  let fixture: ComponentFixture<ImportHopDongMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportHopDongMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportHopDongMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
