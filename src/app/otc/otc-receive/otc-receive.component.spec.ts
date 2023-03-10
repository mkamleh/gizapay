import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcReceiveComponent } from './otc-receive.component';

describe('OtcReceiveComponent', () => {
  let component: OtcReceiveComponent;
  let fixture: ComponentFixture<OtcReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
