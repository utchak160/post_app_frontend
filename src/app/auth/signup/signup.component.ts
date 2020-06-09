import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/index';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthenticationStatus().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
    this.authStatusSub = this.store.pipe(select('user')).pipe(map(userState => userState.isLoggedIn),
      tap((res) => {
        this.isLoading = res;
      })
    ).subscribe();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    form.reset();
  }
}
