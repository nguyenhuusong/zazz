import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsAnCaComponent } from './cs-an-ca.component';

describe('CsAnCaComponent', () => {
  let component: CsAnCaComponent;
  let fixture: ComponentFixture<CsAnCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsAnCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsAnCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
