import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth-interceptor';
import {ErrorComponent} from './error/error.component';
import {ErrorInterceptor} from './error-interceptor';
import {MaterialModule} from './material.module';
import {PostModule} from './post/post.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {rootReducer} from './store';
import {AuthReducer} from './auth/store/auth.reducer';
import {PostReducer} from './post/store/post.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    PostModule,
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
