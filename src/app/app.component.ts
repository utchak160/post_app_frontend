import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {AuthConstant} from './auth/auth-constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'social-frontend';
  constructor(private authService: AuthService) {
  }
  ngOnInit(): void {
    if (localStorage.getItem(AuthConstant.AUTH_TOKEN)) {
      this.authService.autoLoginUser();
    }
  }
}
