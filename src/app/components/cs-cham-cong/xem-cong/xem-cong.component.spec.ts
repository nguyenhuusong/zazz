import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XemCongComponent } from './xem-cong.component';

describe('XemCongComponent', () => {
  let component: XemCongComponent;
  let fixture: ComponentFixture<XemCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XemCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XemCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
