import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAirTimeTopupComponent } from './bulk-air-time-topup.component';

describe('BulkAirTimeTopupComponent', () => {
  let component: BulkAirTimeTopupComponent;
  let fixture: ComponentFixture<BulkAirTimeTopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAirTimeTopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAirTimeTopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
