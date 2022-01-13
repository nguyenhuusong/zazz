import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsChamCongComponent } from './cs-cham-cong.component';

describe('CsChamCongComponent', () => {
  let component: CsChamCongComponent;
  let fixture: ComponentFixture<CsChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsChamCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
