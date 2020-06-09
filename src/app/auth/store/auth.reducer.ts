import {Action, createReducer, on} from '@ngrx/store';
import * as fromAuthAction from './auth.action';

export interface State {
  email: string;
  password: string;
  id: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const initialState: State = {
  email: null,
  password: null,
  id: null,
  isLoggedIn: false,
  isLoading: false
};

const authReducer = createReducer(
  initialState,
  on(fromAuthAction.RegisterSent, fromAuthAction.LoginSent, state => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(fromAuthAction.RegisterSuccess, (state, {email, id}) => {
    return {
      ...state,
      isLoading: false,
      email,
      id,
    };
  }),
  on(fromAuthAction.RegisterFailed, fromAuthAction.LoginFailed, state => {
    return {
      ...state,
      isLoading: false,
    };
  }),
  on(fromAuthAction.LoginSuccess, (state, {email, id}) => {
    return {
      ...state,
      isLoading: false,
      isLoggedIn: true,
      email,
      id
    };
  }),
  on(fromAuthAction.Logout, state => {
    return {
      ...state,
      isLoggedIn: false,
      email: null,
      id: null
    };
  })
);

export function AuthReducer(state: State = initialState, action: Action) {
  return authReducer(state, action);
}

export const _getEmail = (state: State) => state.email;
export const _getId = (state: State) => state.id;
export const _getLoading = (state: State) => state.isLoading;
export const _getIsLoggedIn = (state: State) => state.isLoggedIn;
