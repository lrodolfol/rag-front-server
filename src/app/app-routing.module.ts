import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AuthComponent } from './pages/auth/auth.component';
import { FormServiceComponent } from './pages/portal/form-service/form-service.component';
import { AuthGuard } from './guards/auth.guard';
import {StartFreeComponent} from "./pages/start-free/start-free.component";
import { SpotbotChatOnlineComponent } from './pages/spotbot-chat-online/spotbot-chat-online.component';
import { PortalHomeComponent } from './pages/portal/portal-home/portal-home.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  }, {
    path: 'index',
    component: IndexComponent,
  }, {
    path: 'auth',
    component: AuthComponent
  }, {
    path: 'portal',
    component: PortalHomeComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'form-service',
    component: FormServiceComponent,
    canActivate: [AuthGuard]
  },{
    path: 'start-free',
    component: StartFreeComponent
  },{
    path: 'spotbot-chat-online',
    component: SpotbotChatOnlineComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
