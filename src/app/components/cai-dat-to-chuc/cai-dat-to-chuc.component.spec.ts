import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatToChucComponent } from './cai-dat-to-chuc.component';

describe('CaiDatToChucComponent', () => {
  let component: CaiDatToChucComponent;
  let fixture: ComponentFixture<CaiDatToChucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatToChucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatToChucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
