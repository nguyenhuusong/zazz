import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyenVienTuyenDungComponent } from './chuyen-vien-tuyen-dung.component';

describe('ChuyenVienTuyenDungComponent', () => {
  let component: ChuyenVienTuyenDungComponent;
  let fixture: ComponentFixture<ChuyenVienTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChuyenVienTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyenVienTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
