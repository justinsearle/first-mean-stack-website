import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SingupComponent {
  isLoading = false;

  //function to handle singups
  onSingup(form: NgForm) {
    console.log(form);
  }
}
