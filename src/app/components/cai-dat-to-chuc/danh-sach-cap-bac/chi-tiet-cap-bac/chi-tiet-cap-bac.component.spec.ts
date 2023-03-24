import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCapBacComponent } from './chi-tiet-cap-bac.component';

describe('ChiTietCapBacComponent', () => {
  let component: ChiTietCapBacComponent;
  let fixture: ComponentFixture<ChiTietCapBacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCapBacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCapBacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
