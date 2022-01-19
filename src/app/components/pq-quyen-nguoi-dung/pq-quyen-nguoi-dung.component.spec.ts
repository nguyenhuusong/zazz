import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqQuyenNguoiDungComponent } from './pq-quyen-nguoi-dung.component';

describe('PqQuyenNguoiDungComponent', () => {
  let component: PqQuyenNguoiDungComponent;
  let fixture: ComponentFixture<PqQuyenNguoiDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqQuyenNguoiDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqQuyenNguoiDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
