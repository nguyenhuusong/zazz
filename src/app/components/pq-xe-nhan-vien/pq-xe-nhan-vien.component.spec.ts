import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqXeNhanVienComponent } from './pq-xe-nhan-vien.component';

describe('PqXeNhanVienComponent', () => {
  let component: PqXeNhanVienComponent;
  let fixture: ComponentFixture<PqXeNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqXeNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqXeNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
