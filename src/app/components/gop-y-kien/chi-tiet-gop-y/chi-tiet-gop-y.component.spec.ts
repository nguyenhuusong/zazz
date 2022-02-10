import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietGopYComponent } from './chi-tiet-gop-y.component';

describe('ChiTietGopYComponent', () => {
  let component: ChiTietGopYComponent;
  let fixture: ComponentFixture<ChiTietGopYComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietGopYComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietGopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
