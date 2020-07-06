import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProhibitComponent } from './prohibit.component';

describe('ProhibitComponent', () => {
  let component: ProhibitComponent;
  let fixture: ComponentFixture<ProhibitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProhibitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProhibitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
