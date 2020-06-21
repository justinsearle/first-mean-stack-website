import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'}) //this will allow this module to be the only instance on the server
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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
      .subscribe((transFormedPostData) => {
      // .subscribe((postData) => { //old
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

  //get a single post (use spread operater to pull out all the properties and add them to a new object)
  getPost(id: string) {
    //because we want to load this value from the database so the scenario of reloading on the update form and losing data is fixed
    //we need to return the observable and call synchronously as we cannot return in a subscription.
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id); //new
    // return {...this.posts.find(p => p.id === id)}; //old
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
          console.log("Post Service Add Post RESULT: " + res.message);
          const postId = res.postId;
          post.id = postId; //update post ID with new added id
          this.posts.push(post); //add post to our local class
          this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
          this.router.navigate(["/"]); this.router.navigate(["/"]); //navigate to home (posts list) after adding one
        });
  }

  //This function will update a post then force an update
  updatePost(postId: string, userTitle: string, userContent: string) {
    const post: Post = { id: postId, title: userTitle, content: userContent }
    this.http.put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe(response => {
        console.log("Post Service Update Post RESPONSE: " + response);

        //we could update the front end here because we have the data we need
        //howevere our posts are on another page and they fetch a new copy each time
        //so this code is redundant but left here anyway
        //this will literally do nothing because posts havent been loaded yet but that can be fixed
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list

        this.router.navigate(["/"]); //navigate to home (posts list) after adding one
      });
  }

  //This function will delete a post from the datbase and force an update
  deletePost(postId: string) {
    this.http
      .delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
        .subscribe(() => {
          // console.log("Post Service Delete Post DELETED:" + res.message);

          //remove ui content by removing post and updating
          const updatedPosts = this.posts.filter(post => post.id !== postId); //remove post from array (this is most efficient)
          this.posts = updatedPosts; //update posts with new array
          this.postsUpdated.next([...this.posts]); //force update on frontend
        });
  }
}
