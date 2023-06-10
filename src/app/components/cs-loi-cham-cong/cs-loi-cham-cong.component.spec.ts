import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsLoiChamCongComponent } from './cs-loi-cham-cong.component';

describe('CsLoiChamCongComponent', () => {
  let component: CsLoiChamCongComponent;
  let fixture: ComponentFixture<CsLoiChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsLoiChamCongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsLoiChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
