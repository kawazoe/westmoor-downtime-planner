import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as jexl from 'jexl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  user$ = this.auth.user$;

  jexlResult$ = of('1+1')
    .pipe(
      switchMap(exp => jexl.eval(exp))
    );

  constructor(
    private auth: AuthService
  ) {
  }
}
