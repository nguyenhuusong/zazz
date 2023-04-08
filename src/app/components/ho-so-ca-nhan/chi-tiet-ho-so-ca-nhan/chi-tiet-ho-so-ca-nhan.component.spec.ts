import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietHoSoCaNhanComponent } from './chi-tiet-ho-so-ca-nhan.component';

describe('ChiTietHoSoCaNhanComponent', () => {
  let component: ChiTietHoSoCaNhanComponent;
  let fixture: ComponentFixture<ChiTietHoSoCaNhanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietHoSoCaNhanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietHoSoCaNhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
