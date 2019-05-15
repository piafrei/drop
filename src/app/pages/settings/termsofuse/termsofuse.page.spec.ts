import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TermsofusePage } from "./termsofuse.page";

describe("TermsofusePage", () => {
  let component: TermsofusePage;
  let fixture: ComponentFixture<TermsofusePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermsofusePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsofusePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
