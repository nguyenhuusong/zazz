import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTuyenDungComponent } from './chi-tiet-tuyen-dung.component';

describe('ChiTietTuyenDungComponent', () => {
  let component: ChiTietTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
