import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcSendComponent } from './otc-send.component';

describe('OtcSendComponent', () => {
  let component: OtcSendComponent;
  let fixture: ComponentFixture<OtcSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
