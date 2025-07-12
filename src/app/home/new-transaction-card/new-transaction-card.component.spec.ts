import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransactionCardComponent } from './new-transaction-card.component';

describe('NewTransactionComponent', () => {
  let component: NewTransactionCardComponent;
  let fixture: ComponentFixture<NewTransactionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTransactionCardComponent]
    });
    fixture = TestBed.createComponent(NewTransactionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
