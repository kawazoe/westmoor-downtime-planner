import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AuthHttpInterceptorService } from './services/http-interceptors/auth-http-interceptor.service';
import { AnalyticsHttpInterceptorService } from './services/http-interceptors/analytics-http-interceptor.service';

import { AuthGuard } from './services/route-guards/auth.guard';
import { OidcCallbackGuard } from './services/route-guards/oidc-callback-guard.service';
import { SignInGuard } from './services/route-guards/sign-in-guard.service';
import { SignOutGuard } from './services/route-guards/sign-out-guard.service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AwardDowntimeComponent } from './home/award-downtime.component';
import { AwardProgressComponent } from './home/award-progress.component';
import { ScheduleDowntimeComponent } from './home/schedule-downtime.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityCreateComponent } from './activities/activity-create.component';
import { ActivityUpdateComponent } from './activities/activity-update.component';
import { CharactersComponent } from './characters/characters.component';
import { CharacterCreateComponent } from './characters/character-create.component';
import { CharacterUpdateComponent } from './characters/character-update.component';
import { ApiKeysComponent } from './api-keys/api-keys.component';
import { ApiKeyCreateComponent } from './api-keys/api-key-create.component';
import { ApiKeyUpdateComponent } from './api-keys/api-key-update.component';
import { ModalHeaderComponent } from './components/modal-edit/modal-header.component';
import { ModalDeleteComponent } from './components/modal-edit/modal-delete.component';
import { AlertBoxComponent } from './components/alert-box/alert-box.component';
import { OwnershipComponent } from './components/ownership/ownership.component';
import { PickerComponent } from './components/picker/picker.component';
import { ProgressesPresenterComponent } from './components/progresses-presenter/progresses-presenter.component';
import { CastPipe } from './Pipes/cast.pipe';
import { CanPipe } from './Pipes/can.pipe';
import { IncludesPipe } from './Pipes/includes.pipe';
import { FilterPipe } from './Pipes/filter.pipe';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AwardDowntimeComponent,
    AwardProgressComponent,
    ScheduleDowntimeComponent,
    ActivitiesComponent,
    ActivityCreateComponent,
    ActivityUpdateComponent,
    CharactersComponent,
    CharacterCreateComponent,
    CharacterUpdateComponent,
    ApiKeysComponent,
    ApiKeyCreateComponent,
    ApiKeyUpdateComponent,
    ModalHeaderComponent,
    ModalDeleteComponent,
    AlertBoxComponent,
    OwnershipComponent,
    PickerComponent,
    ProgressesPresenterComponent,
    CastPipe,
    CanPipe,
    IncludesPipe,
    FilterPipe,
    TermsOfServiceComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {
        path: 'activities',
        component: ActivitiesComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: {role: 'Admin'}
      },
      {
        path: 'characters',
        component: CharactersComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: {role: 'Admin'}
      },
      {
        path: 'api-keys',
        component: ApiKeysComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: {role: 'Admin'}
      },
      {path: 'signin', component: HomeComponent, pathMatch: 'full', canActivate: [SignInGuard]},
      {path: 'signout', component: HomeComponent, pathMatch: 'full', canActivate: [SignOutGuard]},
      {path: 'oidc-callback', component: HomeComponent, pathMatch: 'full', canActivate: [OidcCallbackGuard]},
      {path: 'terms-of-service', component: TermsOfServiceComponent, pathMatch: 'full'}
    ]),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AnalyticsHttpInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
