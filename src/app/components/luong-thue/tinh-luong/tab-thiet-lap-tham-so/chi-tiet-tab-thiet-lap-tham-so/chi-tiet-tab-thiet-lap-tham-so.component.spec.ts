import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTabThietLapThamSoComponent } from './chi-tiet-tab-thiet-lap-tham-so.component';

describe('ChiTietTabThietLapThamSoComponent', () => {
  let component: ChiTietTabThietLapThamSoComponent;
  let fixture: ComponentFixture<ChiTietTabThietLapThamSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTabThietLapThamSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTabThietLapThamSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
