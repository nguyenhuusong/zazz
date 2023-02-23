import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabNhanVienComponent } from './tab-nhan-vien.component';

describe('TabNhanVienComponent', () => {
  let component: TabNhanVienComponent;
  let fixture: ComponentFixture<TabNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
