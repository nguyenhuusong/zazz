import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LamNgoaiGioComponent } from './lam-ngoai-gio.component';

describe('LamNgoaiGioComponent', () => {
  let component: LamNgoaiGioComponent;
  let fixture: ComponentFixture<LamNgoaiGioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LamNgoaiGioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LamNgoaiGioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
