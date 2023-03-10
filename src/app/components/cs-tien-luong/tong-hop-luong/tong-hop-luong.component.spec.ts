import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopLuongComponent } from './tong-hop-luong.component';

describe('TongHopLuongComponent', () => {
  let component: TongHopLuongComponent;
  let fixture: ComponentFixture<TongHopLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
