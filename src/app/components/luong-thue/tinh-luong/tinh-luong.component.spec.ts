import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietLapThamSoLuongComponent } from './thiet-lap-tham-so-luong.component';

describe('ThietLapThamSoLuongComponent', () => {
  let component: ThietLapThamSoLuongComponent;
  let fixture: ComponentFixture<ThietLapThamSoLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietLapThamSoLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietLapThamSoLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
