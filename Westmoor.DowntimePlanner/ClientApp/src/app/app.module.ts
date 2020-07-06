import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ApiKeyAuthHttpInterceptorService } from './api-key-auth-http-interceptor.service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ActivitiesComponent } from './activities/activities.component';
import { CharactersComponent } from './characters/characters.component';
import { UsersComponent } from './users/users.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ActivitiesComponent,
    CharactersComponent,
    UsersComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'activities', component: ActivitiesComponent, pathMatch: 'full' },
      { path: 'characters', component: CharactersComponent, pathMatch: 'full' },
      { path: 'users', component: UsersComponent, pathMatch: 'full' },
      { path: 'signin', component: SignInComponent, pathMatch: 'full' },
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiKeyAuthHttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
