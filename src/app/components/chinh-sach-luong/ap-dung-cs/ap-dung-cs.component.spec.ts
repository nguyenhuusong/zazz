import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApDungCsComponent } from './ap-dung-cs.component';

describe('ApDungCsComponent', () => {
  let component: ApDungCsComponent;
  let fixture: ComponentFixture<ApDungCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApDungCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApDungCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
