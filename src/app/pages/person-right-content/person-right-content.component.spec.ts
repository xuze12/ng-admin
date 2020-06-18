import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonRightContentComponent } from './person-right-content.component';

describe('PersonRightContentComponent', () => {
  let component: PersonRightContentComponent;
  let fixture: ComponentFixture<PersonRightContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonRightContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonRightContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
