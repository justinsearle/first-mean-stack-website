import { Component, SystemJsNgModuleLoader } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from '../post.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  enteredTitle ="";
  enteredContent = "";
  // @Output() postCreated = new EventEmitter<Post>(); //another way of emitting this value to an event listener

  constructor(public postsService: PostsService) {} //gets and sets a postsService variable

  onAddPost(form: NgForm) {

    //validate form via angular and html validation
    if (form.invalid) {
      return;
    }
    // this.postCreated.emit(post); //emits

    this.postsService.addPost(form.value.title, form.value.content); //use the post service to add this post
    form.resetForm(); //reset form
  }
}
