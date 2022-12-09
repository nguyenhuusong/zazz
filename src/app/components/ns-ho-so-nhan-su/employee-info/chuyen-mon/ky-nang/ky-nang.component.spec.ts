import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyNangComponent } from './ky-nang.component';

describe('KyNangComponent', () => {
  let component: KyNangComponent;
  let fixture: ComponentFixture<KyNangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KyNangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KyNangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
