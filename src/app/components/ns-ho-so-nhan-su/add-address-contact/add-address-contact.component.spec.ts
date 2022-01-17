import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressContactComponent } from './add-address-contact.component';

describe('AddAddressContactComponent', () => {
  let component: AddAddressContactComponent;
  let fixture: ComponentFixture<AddAddressContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAddressContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
