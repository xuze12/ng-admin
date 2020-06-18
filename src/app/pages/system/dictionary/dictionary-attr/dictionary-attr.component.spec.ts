import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryAttrComponent } from './dictionary-attr.component';

describe('DictionaryAttrComponent', () => {
  let component: DictionaryAttrComponent;
  let fixture: ComponentFixture<DictionaryAttrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictionaryAttrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryAttrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
