import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChonThoiGianComponent } from './chon-thoi-gian.component';

describe('ChonThoiGianComponent', () => {
  let component: ChonThoiGianComponent;
  let fixture: ComponentFixture<ChonThoiGianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChonThoiGianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChonThoiGianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
