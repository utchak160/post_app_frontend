import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from './mime-type.validator';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private postId: string;
  private mode = 'create';
  private authStatusSub = new Subscription();

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthenticationStatus().subscribe((status) => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'update';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData.id,
            title: postData.title,
            description: postData.description,
            imagePath: postData.imagePath,
            author: postData.author
          };
          this.form.setValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    this.isLoading = true;
    if (!this.form.valid) {
      this.isLoading = false;
      return;
    }
    const post = {
      id: null,
      title: this.form.value.title,
      description: this.form.value.description,
      image: this.form.value.image
    };
    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(post, this.postId);
    }
    this.form.reset();
  }

  onSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
