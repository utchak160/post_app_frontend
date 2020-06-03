import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {environment} from '../../environments/environment.prod';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AuthConstant} from './auth-constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly baseUrl = environment.BASE_URL;
  private token: string;
  private tokenTimer: any;
  private userId;
  private isAuthenticated = false;
  private AuthenticationStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ message: string, user: any }>(this.baseUrl + '/api/user/signup', authData).subscribe((response) => {
      this.router.navigate(['/login']);
    }, error => {
      this.AuthenticationStatus.next(false);
      this.isAuthenticated = false;
      console.log(error);
    });
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthenticationStatus() {
    return this.AuthenticationStatus.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>(this.baseUrl + '/api/user/login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresIn = response.expiresIn;
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.AuthenticationStatus.next(true);
          this.userId = response.userId;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, response.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.AuthenticationStatus.next(false);
        this.isAuthenticated = false;
        console.log(error);
      });
  }

  logout() {
    this.AuthenticationStatus.next(false);
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoLoginUser() {
    const {token, expirationDate, userId} = this.getAuthData();
    if (!token || !expirationDate) {
      return;
    }
    const current = new Date();
    const expiresIn = expirationDate.getTime() - current.getTime();
    if (expiresIn > 0) {
      this.token = token;
      this.isAuthenticated = true;
      this.AuthenticationStatus.next(true);
      this.userId = userId;
      this.setAuthTimer(expiresIn / 1000);
    } else {
      this.logout();
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem(AuthConstant.AUTH_TOKEN, token);
    localStorage.setItem(AuthConstant.EXPIRES_IN, expirationDate.toISOString());
    localStorage.setItem(AuthConstant.USER_ID, userId);
  }

  private clearAuthData() {
    localStorage.removeItem(AuthConstant.AUTH_TOKEN);
    localStorage.removeItem(AuthConstant.EXPIRES_IN);
    localStorage.removeItem(AuthConstant.USER_ID);
  }

  private getAuthData() {
    const token = localStorage.getItem(AuthConstant.AUTH_TOKEN);
    const expiresIn = localStorage.getItem(AuthConstant.EXPIRES_IN);
    const userId = localStorage.getItem(AuthConstant.USER_ID);
    if (!token || !expiresIn) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expiresIn),
      userId
    };
  }
}
