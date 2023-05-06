import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingStatusComponent } from './setting-status.component';

describe('SettingStatusComponent', () => {
  let component: SettingStatusComponent;
  let fixture: ComponentFixture<SettingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
