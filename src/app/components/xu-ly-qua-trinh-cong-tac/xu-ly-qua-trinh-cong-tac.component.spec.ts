import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuLyQuaTrinhCongTacComponent } from './xu-ly-qua-trinh-cong-tac.component';

describe('XuLyQuaTrinhCongTacComponent', () => {
  let component: XuLyQuaTrinhCongTacComponent;
  let fixture: ComponentFixture<XuLyQuaTrinhCongTacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuLyQuaTrinhCongTacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuLyQuaTrinhCongTacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
