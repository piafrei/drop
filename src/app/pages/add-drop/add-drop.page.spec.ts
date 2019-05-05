import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDropPage } from './add-drop.page';

describe('AddDropPage', () => {
  let component: AddDropPage;
  let fixture: ComponentFixture<AddDropPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDropPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
