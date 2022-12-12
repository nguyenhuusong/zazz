import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbhDsDinhKemComponent } from './tbh-ds-dinh-kem.component';

describe('TbhDsDinhKemComponent', () => {
  let component: TbhDsDinhKemComponent;
  let fixture: ComponentFixture<TbhDsDinhKemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbhDsDinhKemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbhDsDinhKemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
