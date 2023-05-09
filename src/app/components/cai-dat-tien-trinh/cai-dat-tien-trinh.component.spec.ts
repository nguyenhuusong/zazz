import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatTienTrinhComponent } from './cai-dat-tien-trinh.component';

describe('CaiDatTienTrinhComponent', () => {
  let component: CaiDatTienTrinhComponent;
  let fixture: ComponentFixture<CaiDatTienTrinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatTienTrinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatTienTrinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
