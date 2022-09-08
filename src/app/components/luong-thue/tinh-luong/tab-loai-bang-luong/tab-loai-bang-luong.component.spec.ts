import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabLoaiBangLuongComponent } from './tab-loai-bang-luong.component';

describe('TabLoaiBangLuongComponent', () => {
  let component: TabLoaiBangLuongComponent;
  let fixture: ComponentFixture<TabLoaiBangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabLoaiBangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabLoaiBangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
