import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AuthComponent } from './pages/auth/auth.component';
import { FormServiceComponent } from './pages/form-service/form-service.component';
import { AuthGuard } from './guards/auth.guard';
import {StartFreeComponent} from "./pages/start-free/start-free.component";

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
    path: 'form-service',
    component: FormServiceComponent,
    canActivate: [AuthGuard]
  },{
    path: 'start-free',
    component: StartFreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
