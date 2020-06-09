import {createAction, props} from '@ngrx/store';

export const RegisterSent = createAction('[Auth] Register Sent');
export const RegisterSuccess = createAction('[Auth] Register Success', props<{email: string, id: string}>());
export const RegisterFailed = createAction('[Auth] Register Failed');
export const LoginSent = createAction('[Auth] Login Sent');
export const LoginSuccess = createAction('[Auth] Login Success', props<{email: string, id: string}>());
export const LoginFailed = createAction('[Auth] Login Failed');
export const Logout = createAction('[Auth] Logout');
