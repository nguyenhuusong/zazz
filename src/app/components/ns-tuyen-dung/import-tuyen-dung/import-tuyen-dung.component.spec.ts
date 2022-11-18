import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTuyenDungComponent } from './import-tuyen-dung.component';

describe('ImportTuyenDungComponent', () => {
  let component: ImportTuyenDungComponent;
  let fixture: ComponentFixture<ImportTuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
