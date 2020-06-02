import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material.module';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    AuthRoutingModule
  ]
})

export class AuthModule {
}
