import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietPhepBuComponent } from './chi-tiet-phep-bu.component';

describe('ChiTietPhepBuComponent', () => {
  let component: ChiTietPhepBuComponent;
  let fixture: ComponentFixture<ChiTietPhepBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietPhepBuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietPhepBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
