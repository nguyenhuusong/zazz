import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBangLuongComponent } from './tab-bang-luong.component';

describe('TabBangLuongComponent', () => {
  let component: TabBangLuongComponent;
  let fixture: ComponentFixture<TabBangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabBangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
