import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFormModalComponent } from './menu-form-modal.component';

describe('MenuFormModalComponent', () => {
  let component: MenuFormModalComponent;
  let fixture: ComponentFixture<MenuFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
