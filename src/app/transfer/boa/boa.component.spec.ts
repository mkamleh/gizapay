import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoaComponent } from './boa.component';

describe('BoaComponent', () => {
  let component: BoaComponent;
  let fixture: ComponentFixture<BoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
