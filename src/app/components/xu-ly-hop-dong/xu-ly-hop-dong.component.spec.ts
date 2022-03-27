import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuLyHopDongComponent } from './xu-ly-hop-dong.component';

describe('XuLyHopDongComponent', () => {
  let component: XuLyHopDongComponent;
  let fixture: ComponentFixture<XuLyHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuLyHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuLyHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
