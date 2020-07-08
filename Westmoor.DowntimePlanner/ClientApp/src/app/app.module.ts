import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { ApiKeyAuthHttpInterceptorService } from './api-key-auth-http-interceptor.service';
import { SignoutGuard } from './signout.guard';
import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityCreateComponent } from './activities/activity-create.component';
import { ActivityUpdateComponent } from './activities/activity-update.component';
import { CharactersComponent } from './characters/characters.component';
import { CharacterCreateComponent } from './characters/character-create.component';
import { CharacterUpdateComponent } from './characters/character-update.component';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './users/user-create.component';
import { UserUpdateComponent } from './users/user-update.component';
import { ModalHeaderComponent } from './modal-edit/modal-header.component';
import { ModalDeleteComponent } from './modal-edit/modal-delete.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { CastPipe } from './Pipes/cast.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ActivitiesComponent,
    ActivityCreateComponent,
    ActivityUpdateComponent,
    CharactersComponent,
    CharacterCreateComponent,
    CharacterUpdateComponent,
    UsersComponent,
    UserCreateComponent,
    UserUpdateComponent,
    ModalHeaderComponent,
    ModalDeleteComponent,
    SignInComponent,
    AlertBoxComponent,
    CastPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'activities', component: ActivitiesComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'characters', component: CharactersComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'signin', component: SignInComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'signout', component: SignInComponent, pathMatch: 'full', canActivate: [SignoutGuard] },
    ]),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiKeyAuthHttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
