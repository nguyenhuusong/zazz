import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatTrangThaiComponent } from './cai-dat-trang-thai.component';

describe('CaiDatTrangThaiComponent', () => {
  let component: CaiDatTrangThaiComponent;
  let fixture: ComponentFixture<CaiDatTrangThaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatTrangThaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatTrangThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
