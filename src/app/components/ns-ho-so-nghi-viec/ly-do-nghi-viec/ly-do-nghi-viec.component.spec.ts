import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LyDoNghiViecComponent } from './ly-do-nghi-viec.component';

describe('LyDoNghiViecComponent', () => {
  let component: LyDoNghiViecComponent;
  let fixture: ComponentFixture<LyDoNghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LyDoNghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LyDoNghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
