import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotifyComponent } from './page-notify.component';

describe('PageNotifyComponent', () => {
  let component: PageNotifyComponent;
  let fixture: ComponentFixture<PageNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
