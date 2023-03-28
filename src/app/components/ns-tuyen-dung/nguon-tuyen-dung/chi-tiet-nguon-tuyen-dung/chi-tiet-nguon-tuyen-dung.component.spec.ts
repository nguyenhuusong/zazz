import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNguonTuyenDungComponent } from './chi-tiet-nguon-tuyen-dung.component';

describe('ChiTietNguonTuyenDungComponent', () => {
  let component: ChiTietNguonTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietNguonTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNguonTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNguonTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
