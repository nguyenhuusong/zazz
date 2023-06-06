import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNodeComponent } from './modal-node.component';

describe('ModalNodeComponent', () => {
  let component: ModalNodeComponent;
  let fixture: ComponentFixture<ModalNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
