import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietHopDongComponent } from './chi-tiet-hop-dong.component';

describe('ChiTietHopDongComponent', () => {
  let component: ChiTietHopDongComponent;
  let fixture: ComponentFixture<ChiTietHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
