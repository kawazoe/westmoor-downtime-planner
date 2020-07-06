import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  apiKey: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  signIn() {
    this.auth.signIn(this.apiKey)
      .pipe(
        map(user => {
          if (user) {
            alert(`Signed in as ${user.owner}.`);
            return this.router.navigate(['/']);
          } else {
            alert('Invalid api key.');
            return of(false);
          }
        })
      )
      .subscribe();
  }
}
