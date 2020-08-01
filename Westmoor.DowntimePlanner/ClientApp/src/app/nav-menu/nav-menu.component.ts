import { Component } from '@angular/core';
import { AuthService } from '../services/business/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  user$ = this.auth.user$;

  constructor(
    private auth: AuthService
  ) {
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
