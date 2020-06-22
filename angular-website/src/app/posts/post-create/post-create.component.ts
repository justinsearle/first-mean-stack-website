import { Component, OnInit } from "@angular/core";
// import { NgForm } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  // @Output() postCreated = new EventEmitter<Post>(); //another way of emitting this value to an event listener

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {} //gets and sets a postsService variable

  ngOnInit() {

    //create our form virtually instead
    this.form = new FormGroup({
      'title': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    //check if our route has an edit ID or not by using the injected actived route an observable
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; //show spinner
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false; //hide spinner
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // This function will handle the event of the forms image field changing
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file}); //add the file chosen to our form control
    this.form.get('image').updateValueAndValidity(); //run the validator on our form control for the new file
    console.log(file);
    console.log(this.form);

    //convert image to a dataurl
    const reader = new FileReader();
    reader.onload = () => { //asynchronous code
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file); //load a file (will run onload)
  }

  //called when the user clicks submit on the post create form
  //renamed from onAddPost to onSavePost 6/18/2020
  // onSavePost(form: NgForm) {
  onSavePost() {

    //validate form via angular and html validation
    if (this.form.invalid) {
      return;
    }
    // this.postCreated.emit(post); //emits

    this.isLoading = true; //show spinner

    //check the mode to add or update
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      ); //use the post service to add this post
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      ); //use the post service to add this post
    }

    this.form.reset(); //reset form
  }
}
