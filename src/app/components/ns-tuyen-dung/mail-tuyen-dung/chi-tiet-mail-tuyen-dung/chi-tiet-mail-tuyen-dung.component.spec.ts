import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietViTriTuyenDungComponent } from './chi-tiet-vi-tri-tuyen-dung.component';

describe('ChiTietViTriTuyenDungComponent', () => {
  let component: ChiTietViTriTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietViTriTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietViTriTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietViTriTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
