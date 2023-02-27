import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiamTruThueComponent } from './giam-tru-thue.component';

describe('GiamTruThueComponent', () => {
  let component: GiamTruThueComponent;
  let fixture: ComponentFixture<GiamTruThueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiamTruThueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiamTruThueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
