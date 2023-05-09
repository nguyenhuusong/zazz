import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCaiDatTrangThaiComponent } from './chi-tiet-cai-dat-trang-thai.component';

describe('ChiTietCaiDatTrangThaiComponent', () => {
  let component: ChiTietCaiDatTrangThaiComponent;
  let fixture: ComponentFixture<ChiTietCaiDatTrangThaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCaiDatTrangThaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCaiDatTrangThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
