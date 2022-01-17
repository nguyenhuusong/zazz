import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatCongTyComponent } from './cai-dat-cong-ty.component';

describe('CaiDatCongTyComponent', () => {
  let component: CaiDatCongTyComponent;
  let fixture: ComponentFixture<CaiDatCongTyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatCongTyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatCongTyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
