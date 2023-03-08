import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeLevelNewComponent } from './upgrade-level-new.component';

describe('UpgradeLevelNewComponent', () => {
  let component: UpgradeLevelNewComponent;
  let fixture: ComponentFixture<UpgradeLevelNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeLevelNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeLevelNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
