import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogimageComponent } from './dialogimage.component';

describe('DialogimageComponent', () => {
  let component: DialogimageComponent;
  let fixture: ComponentFixture<DialogimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
