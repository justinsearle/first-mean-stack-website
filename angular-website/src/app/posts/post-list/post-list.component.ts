import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

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
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  //angular automatically executes for us when it creates this component
  ngOnInit() {

    //get posts (empty array)
    this.posts = this.postsService.getPosts();

    //subscribe to post updates from the post service
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  //angular will call this when this is about to get removed in memory
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
 }
