import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietVongTuyenDungComponent } from './chi-tiet-vong-tuyen-dung.component';

describe('ChiTietVongTuyenDungComponent', () => {
  let component: ChiTietVongTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietVongTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietVongTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietVongTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
