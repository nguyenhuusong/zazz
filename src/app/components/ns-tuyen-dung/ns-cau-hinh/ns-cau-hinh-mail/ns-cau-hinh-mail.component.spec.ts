import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsCauHinhMailComponent } from './ns-cau-hinh-mail.component';

describe('NsCauHinhMailComponent', () => {
  let component: NsCauHinhMailComponent;
  let fixture: ComponentFixture<NsCauHinhMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsCauHinhMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsCauHinhMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
