import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhMailComponent } from './cau-hinh-mail.component';

describe('CauHinhMailComponent', () => {
  let component: CauHinhMailComponent;
  let fixture: ComponentFixture<CauHinhMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauHinhMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
