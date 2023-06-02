import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongQuanNhanSuComponent } from './tong-quan-nhan-su.component';

describe('TongQuanNhanSuComponent', () => {
  let component: TongQuanNhanSuComponent;
  let fixture: ComponentFixture<TongQuanNhanSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongQuanNhanSuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TongQuanNhanSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
