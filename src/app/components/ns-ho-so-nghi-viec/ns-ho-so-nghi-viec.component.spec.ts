import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsHoSoNghiViecComponent } from './ns-ho-so-nghi-viec.component';

describe('NsHoSoNghiViecComponent', () => {
  let component: NsHoSoNghiViecComponent;
  let fixture: ComponentFixture<NsHoSoNghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsHoSoNghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsHoSoNghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
