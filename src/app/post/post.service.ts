import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  readonly baseURL = environment.BASE_URL;
  posts: Post[] = [];
  PostSub = new Subject<{ posts: Post[], pageCount: number }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&page=${currentPage}`;
    return this.http.get<{ message: string, posts: any, maxCount: number }>(this.baseURL + '/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return {
            post: postData.posts.map((post) => {
              return {
                title: post.title,
                description: post.description,
                id: post._id,
                imagePath: post.imagePath
              };
            }), maxCount: postData.maxCount
          };
        })).subscribe((res) => {
        this.posts = res.post;
        this.PostSub.next({posts: [...this.posts], pageCount: res.maxCount});
      });
  }

  UpdatedPost() {
    return this.PostSub.asObservable();
  }

  addPost(data) {
    const postData = new FormData();
    postData.append('title', data.title);
    postData.append('description', data.description);
    postData.append('image', data.image);

    this.http.post<{ message: string, post: Post }>(this.baseURL + '/api/posts', postData).subscribe((res) => {
      // const post: Post = {id: res.post.id, title: data.title, description: data.description, imagePath: res.post.imagePath};
      // this.posts.push(post);
      // this.PostSub.next([...this.posts]);
      this.router.navigate(['/']);
    }, error => {
      console.log(error);
    });
  }

  updatePost(data, postId) {
    let postData: Post | FormData;
    if (typeof data.image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', data.title);
      postData.append('desciption', data.description);
      postData.append('image', data.image, data.title);
    } else {
      postData = {
        id: postId,
        title: data.title,
        description: data.description,
        imagePath: data.image
      };
    }
    this.http
      .put(this.baseURL + '/api/posts/' + postId, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        // const post: Post = {
        //   id: postId,
        //   title: data.title,
        //   description: data.description,
        //   imagePath: ''
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.PostSub.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, description: string, imagePath: string }>(this.baseURL + '/api/posts/' + id).pipe(
      map((res) => {
        return {
          id: res._id,
          title: res.title,
          description: res.description,
          imagePath: res.imagePath
        };
      })
    );
  }

  deletePost(id) {
    return this.http.delete<{ message: string }>(this.baseURL + '/api/posts/' + id);
    //   .subscribe((res) => {
    //   const newPosts = this.posts.filter((postData) => postData.id !== id);
    //   this.posts = newPosts;
    //   this.PostSub.next([...this.posts]);
    // });
  }
}
