import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangLuongComponent } from './bang-luong.component';

describe('BangLuongComponent', () => {
  let component: BangLuongComponent;
  let fixture: ComponentFixture<BangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
