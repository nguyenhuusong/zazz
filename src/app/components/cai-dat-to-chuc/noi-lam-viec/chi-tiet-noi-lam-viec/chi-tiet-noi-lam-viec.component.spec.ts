import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNoiLamViecComponent } from './chi-tiet-noi-lam-viec.component';

describe('ChiTietNoiLamViecComponent', () => {
  let component: ChiTietNoiLamViecComponent;
  let fixture: ComponentFixture<ChiTietNoiLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNoiLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNoiLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
