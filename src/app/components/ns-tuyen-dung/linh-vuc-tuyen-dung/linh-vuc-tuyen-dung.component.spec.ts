import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhVucTuyenDungComponent } from './linh-vuc-tuyen-dung.component';

describe('LinhVucTuyenDungComponent', () => {
  let component: LinhVucTuyenDungComponent;
  let fixture: ComponentFixture<LinhVucTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinhVucTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhVucTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
