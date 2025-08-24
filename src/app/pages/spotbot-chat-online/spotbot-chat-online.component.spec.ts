import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotbotChatOnlineComponent } from './spotbot-chat-online.component';

describe('SpotbotChatOnlineComponent', () => {
  let component: SpotbotChatOnlineComponent;
  let fixture: ComponentFixture<SpotbotChatOnlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpotbotChatOnlineComponent]
    });
    fixture = TestBed.createComponent(SpotbotChatOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
