import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BieuMauChiTietComponent } from './bieu-mau-chi-tiet.component';

describe('BieuMauChiTietComponent', () => {
  let component: BieuMauChiTietComponent;
  let fixture: ComponentFixture<BieuMauChiTietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BieuMauChiTietComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BieuMauChiTietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
