import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2pTransferComponent } from './b2p-transfer.component';

describe('B2pTransferComponent', () => {
  let component: B2pTransferComponent;
  let fixture: ComponentFixture<B2pTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2pTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2pTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
