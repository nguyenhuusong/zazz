import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaTrinhLamViecComponent } from './qua-trinh-lam-viec.component';

describe('QuaTrinhLamViecComponent', () => {
  let component: QuaTrinhLamViecComponent;
  let fixture: ComponentFixture<QuaTrinhLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaTrinhLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaTrinhLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
