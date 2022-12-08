import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoiGianLamViecComponent } from './thoi-gian-lam-viec.component';

describe('ThoiGianLamViecComponent', () => {
  let component: ThoiGianLamViecComponent;
  let fixture: ComponentFixture<ThoiGianLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThoiGianLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoiGianLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
