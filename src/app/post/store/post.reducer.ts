import {Post} from '../post.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as PostAction from './post.action';

export interface State {
  posts: Post[];
  count: number;
}

export const initialState: State = {
  posts: [],
  count: 0
};

const postReducer = createReducer(
  initialState,
  on(PostAction.ADD_POST, (state, {post}) => {
    return {
      ...state,
      posts: [...state.posts, post],
      count: state.count + 1
    };
  }),
  on(PostAction.GET_POSTS, (state, { posts, count}) => {
    return {
      ...state,
      posts: [...posts],
      count
    };
  }),
  on(PostAction.DELETE_POST, (state, {id}) => {
    const posts = state.posts.filter(postData => postData.id !== id);
    return {
      ...state,
      posts: [...posts],
      count: state.count - 1
    };
  }),
);

export function PostReducer(state: State = initialState, action: Action) {
  return postReducer(state, action);
}
