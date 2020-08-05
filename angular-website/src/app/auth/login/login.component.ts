import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription

  //inject Auth Service
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusLisenter().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  //function to handle logins
  onLogin(form: NgForm) {
    // console.log(form);
    //check valid form
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    //login user
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
