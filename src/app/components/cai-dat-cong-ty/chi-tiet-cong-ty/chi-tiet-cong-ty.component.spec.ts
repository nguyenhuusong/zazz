import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCongTyComponent } from './chi-tiet-cong-ty.component';

describe('ChiTietCongTyComponent', () => {
  let component: ChiTietCongTyComponent;
  let fixture: ComponentFixture<ChiTietCongTyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCongTyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCongTyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
