import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{message: string, user: any}>(this.baseUrl + '/api/user/signup', authData).subscribe((response) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}
