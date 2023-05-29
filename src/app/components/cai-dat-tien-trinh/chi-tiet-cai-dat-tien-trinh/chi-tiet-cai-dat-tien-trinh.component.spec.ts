import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCaiDatTienTrinhComponent } from './chi-tiet-cai-dat-tien-trinh.component';

describe('ChiTietCaiDatTienTrinhComponent', () => {
  let component: ChiTietCaiDatTienTrinhComponent;
  let fixture: ComponentFixture<ChiTietCaiDatTienTrinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCaiDatTienTrinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCaiDatTienTrinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
