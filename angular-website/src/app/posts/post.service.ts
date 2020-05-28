import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'}) //this will allow this module to be the only instance on the server
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts
        this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
      });

    // return [...this.posts]; //return a copy of our posts not the actual memory reference
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); //return the Subject as an observable
  }

  addPost(userTitle: string, userContent: string) {
    const post: Post = {
      id: null,
      title: userTitle,
      content: userContent
    }; //create post model
    this.http
      .post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        console.log(res.message);
        this.posts.push(post); //add post to our local class
        this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
      });
  }
}
