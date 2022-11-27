import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MucLuongComponent } from './muc-luong.component';

describe('MucLuongComponent', () => {
  let component: MucLuongComponent;
  let fixture: ComponentFixture<MucLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MucLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MucLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
