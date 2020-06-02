import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {environment} from '../../environments/environment';
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
  private isAuthenticated = false;
  private AuthenticationStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ message: string, user: any }>(this.baseUrl + '/api/user/signup', authData).subscribe((response) => {
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
    });
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthenticationStatus() {
    return this.AuthenticationStatus.asObservable();
  }

  getToken() {
    return this.token;
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string, expiresIn: number }>(this.baseUrl + '/api/user/login', authData).subscribe((response) => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresIn = response.expiresIn;
        this.isAuthenticated = true;
        this.AuthenticationStatus.next(true);
        this.setAuthTimer(expiresIn);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
      }
    }, error => {
      console.log(error);
    });
  }

  logout() {
    this.AuthenticationStatus.next(false);
    this.token = null;
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoLoginUser() {
    const {token, expirationDate} = this.getAuthData();
    if (!token || !expirationDate) {
      return;
    }
    const current = new Date();
    const expiresIn = expirationDate.getTime() - current.getTime();
    if (expiresIn > 0) {
      this.token = token;
      this.isAuthenticated = true;
      this.AuthenticationStatus.next(true);
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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem(AuthConstant.AUTH_TOKEN, token);
    localStorage.setItem(AuthConstant.EXPIRES_IN, expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem(AuthConstant.AUTH_TOKEN);
    localStorage.removeItem(AuthConstant.EXPIRES_IN);
  }

  private getAuthData() {
    const token = localStorage.getItem(AuthConstant.AUTH_TOKEN);
    const expiresIn = localStorage.getItem(AuthConstant.EXPIRES_IN);
    if (!token || !expiresIn) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expiresIn)
    };
  }
}
