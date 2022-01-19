import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatThamSoComponent } from './cai-dat-tham-so.component';

describe('CaiDatThamSoComponent', () => {
  let component: CaiDatThamSoComponent;
  let fixture: ComponentFixture<CaiDatThamSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatThamSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatThamSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
