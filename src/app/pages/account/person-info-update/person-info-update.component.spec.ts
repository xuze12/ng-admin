import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonInfoUpdateComponent } from './person-info-update.component';

describe('PersonInfoUpdateComponent', () => {
  let component: PersonInfoUpdateComponent;
  let fixture: ComponentFixture<PersonInfoUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonInfoUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
