import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabNgayCongComponent } from './tab-ngay-cong.component';

describe('TabNgayCongComponent', () => {
  let component: TabNgayCongComponent;
  let fixture: ComponentFixture<TabNgayCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabNgayCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNgayCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
