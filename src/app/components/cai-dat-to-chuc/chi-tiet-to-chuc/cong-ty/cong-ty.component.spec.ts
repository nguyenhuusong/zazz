import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongTyComponent } from './cong-ty.component';

describe('CongTyComponent', () => {
  let component: CongTyComponent;
  let fixture: ComponentFixture<CongTyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongTyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongTyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
