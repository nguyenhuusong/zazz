import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamCongComponent } from './cham-cong.component';

describe('ChamCongComponent', () => {
  let component: ChamCongComponent;
  let fixture: ComponentFixture<ChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChamCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
