import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienLuongComponent } from './tien-luong.component';

describe('TienLuongComponent', () => {
  let component: TienLuongComponent;
  let fixture: ComponentFixture<TienLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
