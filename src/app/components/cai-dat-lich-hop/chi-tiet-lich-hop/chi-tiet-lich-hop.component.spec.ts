import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLichHopComponent } from './chi-tiet-lich-hop.component';

describe('ChiTietLichHopComponent', () => {
  let component: ChiTietLichHopComponent;
  let fixture: ComponentFixture<ChiTietLichHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLichHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLichHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
