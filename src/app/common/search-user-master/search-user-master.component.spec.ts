import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserMasterComponent } from './search-user-master.component';

describe('SearchUserMasterComponent', () => {
  let component: SearchUserMasterComponent;
  let fixture: ComponentFixture<SearchUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchUserMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
