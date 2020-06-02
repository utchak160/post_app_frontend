import {NgModule} from '@angular/core';
import {PostCreateComponent} from './post-create/post-create.component';
import {PostListComponent} from './post-list/post-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    RouterModule,
  ]
})

export class PostModule {
}
