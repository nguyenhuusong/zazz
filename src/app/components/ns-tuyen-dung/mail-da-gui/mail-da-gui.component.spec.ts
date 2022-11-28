import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTuyenDungComponent } from './mail-tuyen-dung.component';

describe('MailTuyenDungComponent', () => {
  let component: MailTuyenDungComponent;
  let fixture: ComponentFixture<MailTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
