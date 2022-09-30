import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCapBacLuongComponent } from './tab-cap-bac-luong.component';

describe('TabCapBacLuongComponent', () => {
  let component: TabCapBacLuongComponent;
  let fixture: ComponentFixture<TabCapBacLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCapBacLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabCapBacLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
