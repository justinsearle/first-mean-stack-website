import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn: 'root'}) //this will allow this module to be the only instance on the server
export class PostsService {
  private posts: Post[] = [];
  // private postsUpdated = new Subject<Post[]>(); //old
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  //This function will update the posts array with new data via the api then force a frontend update
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; //template expression with backticks: dynamically add values into a normal string
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => { //strip the message and update the posts elements
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        }; //returns javascript object
      }))
      .subscribe((transFormedPostData) => {
      // .subscribe((postData) => { //old
        // this.posts = postData.posts //old
        console.log(transFormedPostData);
        this.posts = transFormedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transFormedPostData.maxPosts
        }); //trigger an update by pushing an updated post list
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
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id); //new
    // return {...this.posts.find(p => p.id === id)}; //old
  }

  //This function can be used to add a post to the database by posting angular data to our api
  // 6/21/2020 adding image functionality - json data cannot include images so switching to send form data now
  addPost(userTitle: string, userContent: string, image: File) {
    // const post: Post = { id: null, title: userTitle, content: userContent }; //create post model
    const postData = new FormData();
    postData.append("title", userTitle);
    postData.append("content", userContent);
    postData.append("image", image, userTitle); //user title for alt text
    this.http
      // .post<{message: string, postId: string}>(
      .post<{message: string, post: Post}>(
        BACKEND_URL,
        postData
      )
      .subscribe((res) => {
        console.log("Post Service Add Post RESULT: " + res.message);
        //do not need this code because we navigate which causes a reload
        // const post: Post = {
        //   id: res.post.id,
        //   title: userTitle,
        //   content: userContent,
        //   imagePath: res.post.imagePath
        // }
        // // const postId = res.postId;
        // // post.id = postId; //update post ID with new added id
        // this.posts.push(post); //add post to our local class
        // this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list
        this.router.navigate(["/"]); //navigate to home (posts list) after adding one
      });
  }

  //This function will update a post then force an update
  updatePost(postId: string, userTitle: string, userContent: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", postId); //must include ID to update
      postData.append("title", userTitle);
      postData.append("content", userContent);
      postData.append("image", image, userTitle); //title for alt text
    } else {
      postData = {
        id: postId,
        title: userTitle,
        content: userContent,
        imagePath: image,
        creator: null //handle this via server
      }
    }
    this.http.put(BACKEND_URL + postId, postData)
      .subscribe(response => {
        console.log("Post Service Update Post RESPONSE: " + response);

        //we could update the front end here because we have the data we need
        //howevere our posts are on another page and they fetch a new copy each time
        //so this code is redundant but left here anyway
        //this will literally do nothing because posts havent been loaded at this point
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        // const post: Post = {
        //   id: postId,
        //   title: userTitle,
        //   content: userContent,
        //   //imagePath: response.imagePath //TODO
        //   imagePath: ""
        // }
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]); //trigger an update by pushing an updated post list

        this.router.navigate(["/"]); //navigate to home (posts list) after adding one
      });
  }

  //This function will delete a post from the datbase and force an update
  //new easy way is to return the configured http call
  deletePost(postId: string) {
    return this.http
      .delete<{message: string}>(BACKEND_URL + postId)
        // .subscribe(() => {
        //   // console.log("Post Service Delete Post DELETED:" + res.message);

        //   //remove ui content by removing post and updating
        //   const updatedPosts = this.posts.filter(post => post.id !== postId); //remove post from array (this is most efficient)
        //   this.posts = updatedPosts; //update posts with new array
        //   this.postsUpdated.next([...this.posts]); //force update on frontend
        // });
  }
}
