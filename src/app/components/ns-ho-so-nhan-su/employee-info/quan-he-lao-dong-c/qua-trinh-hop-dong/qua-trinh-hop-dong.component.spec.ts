import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaTrinhHopDongComponent } from './qua-trinh-hop-dong.component';

describe('QuaTrinhHopDongComponent', () => {
  let component: QuaTrinhHopDongComponent;
  let fixture: ComponentFixture<QuaTrinhHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaTrinhHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaTrinhHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
