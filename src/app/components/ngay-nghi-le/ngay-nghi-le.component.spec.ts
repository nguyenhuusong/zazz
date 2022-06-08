import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgayNghiLeComponent } from './ngay-nghi-le.component';

describe('NgayNghiLeComponent', () => {
  let component: NgayNghiLeComponent;
  let fixture: ComponentFixture<NgayNghiLeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgayNghiLeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgayNghiLeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
