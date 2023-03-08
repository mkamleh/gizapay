import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAirtimeTopUpComponent } from './sell-airtime-top-up.component';

describe('SellAirtimeTopUpComponent', () => {
  let component: SellAirtimeTopUpComponent;
  let fixture: ComponentFixture<SellAirtimeTopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAirtimeTopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAirtimeTopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
