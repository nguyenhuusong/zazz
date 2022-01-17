import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttachFileComponent } from './emp-attach-file.component';

describe('EmpAttachFileComponent', () => {
  let component: EmpAttachFileComponent;
  let fixture: ComponentFixture<EmpAttachFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAttachFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttachFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
