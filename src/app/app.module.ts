import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormServiceComponent } from './pages/portal/form-service/form-service.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PortalHomeComponent } from './pages/portal/portal-home/portal-home.component';
import { PortalCreditCardComponent } from './pages/portal/credit-card/portal-credit-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './pages/index/index.component';
import { StartFreeComponent } from './pages/start-free/start-free.component';
import { SpotbotChatOnlineComponent } from './pages/spotbot-chat-online/spotbot-chat-online.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    FormServiceComponent,
    PortalHomeComponent,
    PortalCreditCardComponent,
    IndexComponent,
    StartFreeComponent,
    SpotbotChatOnlineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
