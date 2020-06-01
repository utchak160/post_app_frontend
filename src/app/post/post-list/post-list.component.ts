import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';

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
  Sub = new Subscription();

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.pageNumber);
    this.Sub = this.postService.UpdatedPost().subscribe(
      (res) => {
        this.isLoading = false;
        this.posts = res.posts;
        this.totalPosts = res.pageCount;
      }
    );
  }
  ngOnDestroy(): void {
    this.Sub.unsubscribe();
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
    });
  }
}
