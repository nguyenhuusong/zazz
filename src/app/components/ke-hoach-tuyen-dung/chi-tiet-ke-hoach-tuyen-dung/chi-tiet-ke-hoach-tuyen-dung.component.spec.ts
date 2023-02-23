import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietKeHoachTuyenDungComponent } from './chi-tiet-ke-hoach-tuyen-dung.component';

describe('ChiTietKeHoachTuyenDungComponent', () => {
  let component: ChiTietKeHoachTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietKeHoachTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietKeHoachTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietKeHoachTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
