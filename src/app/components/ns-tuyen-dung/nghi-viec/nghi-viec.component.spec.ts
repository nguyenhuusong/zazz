import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NghiViecComponent } from './nghi-viec.component';

describe('NghiViecComponent', () => {
  let component: NghiViecComponent;
  let fixture: ComponentFixture<NghiViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NghiViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NghiViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
