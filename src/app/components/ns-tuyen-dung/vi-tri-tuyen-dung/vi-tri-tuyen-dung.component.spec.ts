import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViTriTuyenDungComponent } from './vi-tri-tuyen-dung.component';

describe('ViTriTuyenDungComponent', () => {
  let component: ViTriTuyenDungComponent;
  let fixture: ComponentFixture<ViTriTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViTriTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViTriTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
