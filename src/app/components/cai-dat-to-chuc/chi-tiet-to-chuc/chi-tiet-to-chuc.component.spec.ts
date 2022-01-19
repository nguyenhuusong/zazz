import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietToChucComponent } from './chi-tiet-to-chuc.component';

describe('ChiTietToChucComponent', () => {
  let component: ChiTietToChucComponent;
  let fixture: ComponentFixture<ChiTietToChucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietToChucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietToChucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
