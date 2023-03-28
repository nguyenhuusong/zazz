import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NguonTuyenDungComponent } from './nguon-tuyen-dung.component';

describe('NguonTuyenDungComponent', () => {
  let component: NguonTuyenDungComponent;
  let fixture: ComponentFixture<NguonTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NguonTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NguonTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
