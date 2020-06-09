import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/index';
import {getIsLoggedIn} from '../store/index';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated;
  private AuthenticationSub = new Subscription();

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    // this.isAuthenticated = this.authService.getIsAuthenticated();
    // this.AuthenticationSub = this.authService.getAuthenticationStatus().subscribe((status) => {
    //   this.isAuthenticated = status;
    // });
    this.AuthenticationSub = this.store.pipe(select('user')).pipe(
      map(state => state.isLoggedIn),
    ).subscribe((res) => {
      this.isAuthenticated = res;
    });
  }

  ngOnDestroy(): void {
    this.AuthenticationSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
