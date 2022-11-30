import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsCauHinhComponent } from './ns-cau-hinh.component';

describe('NsCauHinhComponent', () => {
  let component: NsCauHinhComponent;
  let fixture: ComponentFixture<NsCauHinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsCauHinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsCauHinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
