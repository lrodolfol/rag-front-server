import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartFreeComponent } from './start-free.component';

describe('StartFreeComponent', () => {
  let component: StartFreeComponent;
  let fixture: ComponentFixture<StartFreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartFreeComponent]
    });
    fixture = TestBed.createComponent(StartFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
