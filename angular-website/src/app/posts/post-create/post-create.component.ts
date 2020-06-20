import { Component, SystemJsNgModuleLoader, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Post } from '../post.model';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle ="";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;

  // @Output() postCreated = new EventEmitter<Post>(); //another way of emitting this value to an event listener

  constructor(public postsService: PostsService, public route: ActivatedRoute) {} //gets and sets a postsService variable

  ngOnInit() {
    //check if our route has an edit ID or not by using the injected actived route an observable
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; //show spinner
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false; //hide spinner
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  //called when the user clicks submit on the post create form
  //renamed from onAddPost to onSavePost 6/18/2020
  onSavePost(form: NgForm) {

    //validate form via angular and html validation
    if (form.invalid) {
      return;
    }
    // this.postCreated.emit(post); //emits

    this.isLoading = true; //show spinner

    //check the mode to add or update
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content); //use the post service to add this post
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content); //use the post service to add this post
    }

    form.resetForm(); //reset form
  }
}
