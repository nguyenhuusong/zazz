import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeHoachTuyenDungComponent } from './ke-hoach-tuyen-dung.component';

describe('KeHoachTuyenDungComponent', () => {
  let component: KeHoachTuyenDungComponent;
  let fixture: ComponentFixture<KeHoachTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeHoachTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeHoachTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
