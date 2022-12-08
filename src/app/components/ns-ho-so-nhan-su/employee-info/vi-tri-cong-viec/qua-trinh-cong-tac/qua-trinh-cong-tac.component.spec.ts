import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaTrinhCongTacComponent } from './qua-trinh-cong-tac.component';

describe('QuaTrinhCongTacComponent', () => {
  let component: QuaTrinhCongTacComponent;
  let fixture: ComponentFixture<QuaTrinhCongTacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaTrinhCongTacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaTrinhCongTacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
