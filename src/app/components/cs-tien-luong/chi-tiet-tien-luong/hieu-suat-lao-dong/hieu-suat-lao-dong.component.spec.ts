import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HieuSuatLaoDongComponent } from './hieu-suat-lao-dong.component';

describe('HieuSuatLaoDongComponent', () => {
  let component: HieuSuatLaoDongComponent;
  let fixture: ComponentFixture<HieuSuatLaoDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HieuSuatLaoDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HieuSuatLaoDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
