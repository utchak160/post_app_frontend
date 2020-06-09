import {createAction, props} from '@ngrx/store';
import {Post} from '../post.model';

export const GET_POSTS = createAction('[Post] Get Post', props<{posts: Post[], count: number}>());
export const ADD_POST = createAction('[Post] Add Post', props<{post: Post}>());
export const UPDATE_POST = createAction('[Post] Update post', props<{id: string, post: Post}>());
export const DELETE_POST = createAction('[Post] Delete post', props<{id: string}>());
