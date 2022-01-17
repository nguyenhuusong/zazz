import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietChamCongComponent } from './chi-tiet-cham-cong.component';

describe('ChiTietChamCongComponent', () => {
  let component: ChiTietChamCongComponent;
  let fixture: ComponentFixture<ChiTietChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietChamCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
