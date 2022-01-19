import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichLamViecComponent } from './lich-lam-viec.component';

describe('LichLamViecComponent', () => {
  let component: LichLamViecComponent;
  let fixture: ComponentFixture<LichLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LichLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LichLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
