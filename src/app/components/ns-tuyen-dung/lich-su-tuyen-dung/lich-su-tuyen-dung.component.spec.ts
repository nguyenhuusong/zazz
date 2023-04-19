import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichSuTuyenDungComponent } from './lich-su-tuyen-dung.component';

describe('LichSuTuyenDungComponent', () => {
  let component: LichSuTuyenDungComponent;
  let fixture: ComponentFixture<LichSuTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LichSuTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LichSuTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
