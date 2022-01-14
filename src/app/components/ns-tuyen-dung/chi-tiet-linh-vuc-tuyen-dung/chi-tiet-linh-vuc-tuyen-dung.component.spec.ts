import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietLinhVucTuyenDungComponent } from './chi-tiet-linh-vuc-tuyen-dung.component';

describe('ChiTietLinhVucTuyenDungComponent', () => {
  let component: ChiTietLinhVucTuyenDungComponent;
  let fixture: ComponentFixture<ChiTietLinhVucTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietLinhVucTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietLinhVucTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
