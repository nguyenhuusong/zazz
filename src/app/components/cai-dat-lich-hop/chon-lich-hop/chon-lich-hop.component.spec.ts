import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChonLichHopComponent } from './chon-lich-hop.component';

describe('ChonLichHopComponent', () => {
  let component: ChonLichHopComponent;
  let fixture: ComponentFixture<ChonLichHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChonLichHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChonLichHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
