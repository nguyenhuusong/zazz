import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoTuyenDungComponent } from './bao-cao-tuyen-dung.component';

describe('BaoCaoTuyenDungComponent', () => {
  let component: BaoCaoTuyenDungComponent;
  let fixture: ComponentFixture<BaoCaoTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
