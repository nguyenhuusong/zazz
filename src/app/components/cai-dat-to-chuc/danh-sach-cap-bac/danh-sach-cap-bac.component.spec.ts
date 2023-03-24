import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachCapBacComponent } from './danh-sach-cap-bac.component';

describe('DanhSachCapBacComponent', () => {
  let component: DanhSachCapBacComponent;
  let fixture: ComponentFixture<DanhSachCapBacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachCapBacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachCapBacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
