import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsHoSoNhanSuComponent } from './ns-ho-so-nhan-su.component';

describe('NsHoSoNhanSuComponent', () => {
  let component: NsHoSoNhanSuComponent;
  let fixture: ComponentFixture<NsHoSoNhanSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsHoSoNhanSuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsHoSoNhanSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
