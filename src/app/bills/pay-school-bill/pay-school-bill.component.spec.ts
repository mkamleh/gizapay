import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySchoolBillComponent } from './pay-school-bill.component';

describe('PaySchoolBillComponent', () => {
  let component: PaySchoolBillComponent;
  let fixture: ComponentFixture<PaySchoolBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySchoolBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySchoolBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
