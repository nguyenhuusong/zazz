import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsGiaiTrinhCongComponent } from './cs-giai-trinh-cong.component';

describe('CsGiaiTrinhCongComponent', () => {
  let component: CsGiaiTrinhCongComponent;
  let fixture: ComponentFixture<CsGiaiTrinhCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsGiaiTrinhCongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsGiaiTrinhCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
