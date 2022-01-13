import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsNghiPhepComponent } from './cs-nghi-phep.component';

describe('CsNghiPhepComponent', () => {
  let component: CsNghiPhepComponent;
  let fixture: ComponentFixture<CsNghiPhepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsNghiPhepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsNghiPhepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
