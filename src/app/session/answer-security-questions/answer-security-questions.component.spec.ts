import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSecurityQuestionsComponent } from './answer-security-questions.component';

describe('AnswerSecurityQuestionsComponent', () => {
  let component: AnswerSecurityQuestionsComponent;
  let fixture: ComponentFixture<AnswerSecurityQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerSecurityQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
