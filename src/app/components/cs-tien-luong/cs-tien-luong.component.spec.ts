import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsTienLuongComponent } from './cs-tien-luong.component';

describe('CsTienLuongComponent', () => {
  let component: CsTienLuongComponent;
  let fixture: ComponentFixture<CsTienLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsTienLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsTienLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
