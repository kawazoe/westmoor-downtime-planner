import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../alert-box/alert.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  form = new FormGroup({
    apiKey: new FormControl('', Validators.required)
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
  }

  signIn() {
    this.auth.signIn(this.form.controls.apiKey.value)
      .pipe(
        switchMap(() => this.router.navigate(['/'])),
        catchError(err => {
          this.alert.push({ type: 'danger', message: err.message || err, timeout: 10000 });
          return of(false);
        })
      )
      .subscribe();
  }
}
