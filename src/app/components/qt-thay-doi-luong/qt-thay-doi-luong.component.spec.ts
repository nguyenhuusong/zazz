import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtThayDoiLuongComponent } from './qt-thay-doi-luong.component';

describe('QtThayDoiLuongComponent', () => {
  let component: QtThayDoiLuongComponent;
  let fixture: ComponentFixture<QtThayDoiLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QtThayDoiLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QtThayDoiLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
