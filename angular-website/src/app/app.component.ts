import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

// import { Post } from './posts/post.model';

//This gets loaded when the application starts up
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //get our auth service
  constructor(private authService: AuthService) {}

  //use on init
  ngOnInit() {
    this.authService.autoAuthUser(); //attempt to auto authorize user
  }

  //This code is leftover from when i was testing and learing
  // storedPosts: Post[] = [];

  // Add post via event listener of button (UI ONLY)
  // onPostAdded(post) {
  //   this.storedPosts.push(post);
  // }
}
