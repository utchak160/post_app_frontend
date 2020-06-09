import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/index';
import {map, tap} from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthenticationStatus().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
    this.authStatusSub = this.store.pipe(select('user')).pipe(map(userState => userState.isLoggedIn),
      tap((res) => {
        this.isLoading = false;
      })
    ).subscribe();
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    form.reset();
  }
}
