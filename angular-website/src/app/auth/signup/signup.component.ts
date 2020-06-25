import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SingupComponent {
  isLoading = false;

  //use constructor to inject auth service
  constructor(public authService: AuthService) {}

  //function to handle singups
  onSingup(form: NgForm) {
    //check valid form
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password); //attempt to create a user
  }
}
