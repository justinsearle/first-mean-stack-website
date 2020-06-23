import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  //angular automatically executes for us when it creates this component
  ngOnInit() {
    this.isLoading = true; //show spinner

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
    });
  }

  //angular will call this when this is about to get removed in memory
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
