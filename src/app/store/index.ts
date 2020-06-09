import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromPostReducer from '../post/store/post.reducer';
import {ActionReducerMap, createSelector} from '@ngrx/store';


export interface AppState {
  user: fromAuthReducer.State;
  post: fromPostReducer.State;
}

export const rootReducer: ActionReducerMap<AppState> = {
  user: fromAuthReducer.AuthReducer,
  post: fromPostReducer.PostReducer,
};

export const getUserState = state => state.user;

export const getUser = createSelector(
  getUserState,
  fromAuthReducer._getEmail,
);

export const getIsLoading = createSelector(
  getUserState,
  fromAuthReducer._getLoading
);

export const getIsLoggedIn = createSelector(
  getUserState,
  fromAuthReducer._getIsLoggedIn
);
