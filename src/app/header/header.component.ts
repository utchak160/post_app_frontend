import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private isAuthenticated;
  private AuthenticationSub = new Subscription();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.AuthenticationSub = this.authService.getAuthenticationStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    this.AuthenticationSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
