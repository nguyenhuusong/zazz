import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbhQtDongBtComponent } from './tbh-qt-dong-bt.component';

describe('TbhQtDongBtComponent', () => {
  let component: TbhQtDongBtComponent;
  let fixture: ComponentFixture<TbhQtDongBtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbhQtDongBtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbhQtDongBtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
