import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'}) //this will allow this module to be the only instance on the server
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  //This function will update the posts array with new data via the api then force a frontend update
  getPosts() {
    this.http
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => { //strip the message and update the posts elements
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      // .subscribe((postData) => { //old
      .subscribe((transFormedPostData) => {
        // this.posts = postData.posts //old
        this.posts = transFormedPostData
        this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
      });

    // return [...this.posts]; //return a copy of our posts not the actual memory reference //old
  }

  //This returns an external event listener basically for when the posts array gets updated
  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); //return the Subject as an observable
  }

  //This function can be used to add a post to the database by posting angular data to our api
  addPost(userTitle: string, userContent: string) {
    const post: Post = {
      id: null,
      title: userTitle,
      content: userContent
    }; //create post model
    this.http
      .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
        .subscribe((res) => {
          //console.log("RESULT: " + res.message);
          const postId = res.postId;
          post.id = postId; //update post ID with new added id
          this.posts.push(post); //add post to our local class
          this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
        });
  }

  //This function will delete a post from the datbase and force an update
  deletePost(postId: string) {
    this.http
      .delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
        .subscribe(() => {
          //console.log('Deleted!: ' + res.message);

          //remove ui content by removing post and updating
          const updatedPosts = this.posts.filter(post => post.id !== postId); //remove post from array (this is most efficient)
          this.posts = updatedPosts; //update posts with new array
          this.postsUpdated.next([...this.posts]); //force update on frontend
        });
  }
}
