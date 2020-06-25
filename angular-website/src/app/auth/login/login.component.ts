import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  //inject Auth Service
  constructor(public authService: AuthService) {}

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
