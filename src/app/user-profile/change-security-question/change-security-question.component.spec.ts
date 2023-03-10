import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSecurityQuestionComponent } from './change-security-question.component';

describe('ChangeSecurityQuestionComponent', () => {
  let component: ChangeSecurityQuestionComponent;
  let fixture: ComponentFixture<ChangeSecurityQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSecurityQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSecurityQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
