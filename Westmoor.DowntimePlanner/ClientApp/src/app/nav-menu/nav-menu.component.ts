import { Component } from '@angular/core';
import { AuthService, hasRole } from '../auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  user$ = this.auth.user$;
  isAdmin$ = hasRole('Admin')(this.auth.user$);

  constructor(
    private auth: AuthService
  ) {
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  signIn() {
    this.auth.signIn().subscribe();
  }
}
