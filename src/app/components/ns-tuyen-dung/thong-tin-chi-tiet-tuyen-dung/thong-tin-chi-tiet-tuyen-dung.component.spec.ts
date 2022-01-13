import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinChiTietTuyenDungComponent } from './thong-tin-chi-tiet-tuyen-dung.component';

describe('ThongTinChiTietTuyenDungComponent', () => {
  let component: ThongTinChiTietTuyenDungComponent;
  let fixture: ComponentFixture<ThongTinChiTietTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinChiTietTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinChiTietTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
