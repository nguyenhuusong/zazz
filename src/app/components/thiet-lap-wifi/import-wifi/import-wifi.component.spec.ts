import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWifiComponent } from './import-wifi.component';

describe('ImportWifiComponent', () => {
  let component: ImportWifiComponent;
  let fixture: ComponentFixture<ImportWifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportWifiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
