import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietLapTangThangMayComponent } from './thiet-lap-tang-thang-may.component';

describe('ThietLapTangThangMayComponent', () => {
  let component: ThietLapTangThangMayComponent;
  let fixture: ComponentFixture<ThietLapTangThangMayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietLapTangThangMayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietLapTangThangMayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
