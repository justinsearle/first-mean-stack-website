import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title:'my post 1', content:'my content'},
  //   {title:'my post 2', content:'my content 2'},
  //   {title:'my post 3', content:'my content 3'}
  // ];
  // @Input() posts: Post[] = []; //another way of using a 2 way binding to get the updates posts from a sub module

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0; //pagination
  postsPerPage = 2; //pagination
  currentPage = 1; //pagination
  pageSizeOptions = [1, 2, 5, 10]; //pagination
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSubs: Subscription;

  //inject Post service and Auth Service
  constructor(public postsService: PostsService, private authService: AuthService) {}

  //angular automatically executes for us when it creates this component
  ngOnInit() {
    this.isLoading = true; //show spinner

    //fetch user id
    this.userId = this.authService.getUserId();

    //get posts (empty array)
    // this.posts = this.postsService.getPosts();
    //get posts (trigger)
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    //subscribe to post updates from the post service
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false; //hide spinner
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });

    //get current auth status
    this.userIsAuthenticated = this.authService.getIsAuth();

    //subscribe to auth status
    this.authStatusSubs = this.authService
      .getAuthStatusLisenter()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId(); //update authorization when it changes
      });
  }

  //create an event listener for our pagination module
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true; //show spinner
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    //get posts (trigger)
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  //click event to delete a post
  onDelete(postId: string) {
    this.isLoading = true; //show spinner
    // this.postsService.deletePost(postId);
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage); //new way
    }, () => {
      this.isLoading = false; //hide spinner
    });
  }

  //angular will call this when this is about to get removed in memory
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
