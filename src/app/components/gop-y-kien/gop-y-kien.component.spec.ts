import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GopYKienComponent } from './gop-y-kien.component';

describe('GopYKienComponent', () => {
  let component: GopYKienComponent;
  let fixture: ComponentFixture<GopYKienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GopYKienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GopYKienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
