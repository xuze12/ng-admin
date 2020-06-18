import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrFormModalComponent } from './attr-form-modal.component';

describe('AttrFormModalComponent', () => {
  let component: AttrFormModalComponent;
  let fixture: ComponentFixture<AttrFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttrFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
