import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSettingStatusComponent } from './detail-setting-status.component';

describe('DetailSettingStatusComponent', () => {
  let component: DetailSettingStatusComponent;
  let fixture: ComponentFixture<DetailSettingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSettingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSettingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
