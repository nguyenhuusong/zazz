import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VongTuyenDungComponent } from './vong-tuyen-dung.component';

describe('VongTuyenDungComponent', () => {
  let component: VongTuyenDungComponent;
  let fixture: ComponentFixture<VongTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VongTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VongTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
