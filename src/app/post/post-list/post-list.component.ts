import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postPerPage = 2;
  pageNumber = 1;
  pageSizeOption = [1, 2, 3, 5, 7];
  isAuthenticated = false;
  userId;
  private PostSub = new Subscription();
  private AuthSub = new Subscription();

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.pageNumber);
    this.userId = this.authService.getUserId();
    this.PostSub = this.postService.UpdatedPost().subscribe(
      (res) => {
        this.isLoading = false;
        this.posts = res.posts;
        this.totalPosts = res.pageCount;
      }
    );
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.AuthSub = this.authService.getAuthenticationStatus().subscribe((status) => {
      this.userId = this.authService.getUserId();
      this.isAuthenticated = status;
    });
  }
  ngOnDestroy(): void {
    this.PostSub.unsubscribe();
    this.AuthSub.unsubscribe();
  }

  onPaginate(pageEvent: PageEvent) {
    this.isLoading = true;
    this.postPerPage = +pageEvent.pageSize;
    this.pageNumber = +pageEvent.pageIndex + 1;
    this.postService.getPosts(this.postPerPage, this.pageNumber);
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.pageNumber);
    }, error => {
      this.isLoading = false;
    });
  }
}
