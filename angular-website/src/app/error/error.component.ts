import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component ({
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  //pass data to dynamic error dialog
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

}

