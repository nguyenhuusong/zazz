import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniCommonComponent } from './uni-common.component';

describe('UniCommonComponent', () => {
  let component: UniCommonComponent;
  let fixture: ComponentFixture<UniCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
