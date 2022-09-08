import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabThietLapThamSoComponent } from './tab-thiet-lap-tham-so.component';

describe('TabThietLapThamSoComponent', () => {
  let component: TabThietLapThamSoComponent;
  let fixture: ComponentFixture<TabThietLapThamSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabThietLapThamSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabThietLapThamSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
