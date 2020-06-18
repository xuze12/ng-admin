import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSelectModalComponent } from './page-select-modal.component';

describe('PageSelectModalComponent', () => {
  let component: PageSelectModalComponent;
  let fixture: ComponentFixture<PageSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
