import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly baseUrl = environment.BASE_URL;
  private token: string;
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
    this.http.post<{ token: string }>(this.baseUrl + '/api/user/login', authData).subscribe((response) => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.AuthenticationStatus.next(true);
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
    this.router.navigate(['/']);
  }
}
