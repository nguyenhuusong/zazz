import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaTrinhDaoTaoComponent } from './qua-trinh-dao-tao.component';

describe('QuaTrinhDaoTaoComponent', () => {
  let component: QuaTrinhDaoTaoComponent;
  let fixture: ComponentFixture<QuaTrinhDaoTaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaTrinhDaoTaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaTrinhDaoTaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
