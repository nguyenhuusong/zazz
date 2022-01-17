import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractInfoComponent } from './create-contract-info.component';

describe('CreateContractInfoComponent', () => {
  let component: CreateContractInfoComponent;
  let fixture: ComponentFixture<CreateContractInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateContractInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
