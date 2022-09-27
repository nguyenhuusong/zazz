import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCaiDatQuyenComponent } from './chi-tiet-cai-dat-quyen.component';

describe('ChiTietCaiDatQuyenComponent', () => {
  let component: ChiTietCaiDatQuyenComponent;
  let fixture: ComponentFixture<ChiTietCaiDatQuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCaiDatQuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCaiDatQuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
