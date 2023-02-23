import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietXuLyQtCongTacComponent } from './chi-tiet-xu-ly-qt-cong-tac.component';

describe('ChiTietXuLyQtCongTacComponent', () => {
  let component: ChiTietXuLyQtCongTacComponent;
  let fixture: ComponentFixture<ChiTietXuLyQtCongTacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietXuLyQtCongTacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietXuLyQtCongTacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
