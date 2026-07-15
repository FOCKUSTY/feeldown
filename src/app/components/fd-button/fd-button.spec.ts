import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { FdButton } from './fd-button.component';

describe('TvButton', () => {
  let component: FdButton;
  let fixture: ComponentFixture<FdButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdButton],
    }).compileComponents();

    fixture = TestBed.createComponent(FdButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
