import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinLinhVucTuyenDungComponent } from './thong-tin-linh-vuc-tuyen-dung.component';

describe('ThongTinLinhVucTuyenDungComponent', () => {
  let component: ThongTinLinhVucTuyenDungComponent;
  let fixture: ComponentFixture<ThongTinLinhVucTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinLinhVucTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinLinhVucTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
