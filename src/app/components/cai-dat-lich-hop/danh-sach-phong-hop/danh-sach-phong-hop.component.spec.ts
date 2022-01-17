import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachPhongHopComponent } from './danh-sach-phong-hop.component';

describe('DanhSachPhongHopComponent', () => {
  let component: DanhSachPhongHopComponent;
  let fixture: ComponentFixture<DanhSachPhongHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachPhongHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachPhongHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
