import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsTuyenDungComponent } from './ns-tuyen-dung.component';

describe('NsTuyenDungComponent', () => {
  let component: NsTuyenDungComponent;
  let fixture: ComponentFixture<NsTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
