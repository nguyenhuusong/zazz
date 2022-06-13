import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BieuMauComponent } from './bieu-mau.component';

describe('BieuMauComponent', () => {
  let component: BieuMauComponent;
  let fixture: ComponentFixture<BieuMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BieuMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BieuMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
