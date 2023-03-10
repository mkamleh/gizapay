
import { UpgradeLevelNewComponent } from './customer-upgrade-level.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

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
