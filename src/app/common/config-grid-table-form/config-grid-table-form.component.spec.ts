import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGridTableFormComponent } from './config-grid-table-form.component';

describe('ConfigGridTableFormComponent', () => {
  let component: ConfigGridTableFormComponent;
  let fixture: ComponentFixture<ConfigGridTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigGridTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGridTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
