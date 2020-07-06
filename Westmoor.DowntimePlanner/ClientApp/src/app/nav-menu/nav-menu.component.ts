import { Component } from '@angular/core';
import { AuthService, hasRole } from '../auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  isSignedOut$ = map(u => !u)(this.auth.user$);
  isAdmin$ = hasRole('Admin')(this.auth.user$);

  constructor(private auth: AuthService) {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
