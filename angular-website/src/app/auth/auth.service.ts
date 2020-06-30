import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer; //made available by typescript
  private authStatusListener = new Subject<boolean>(); //push auth info to components that are interested

  //inject HTTP client and angular Router
  constructor(private http: HttpClient, private router: Router) {}

  //return the private token to front end
  getToken() {
    return this.token;
  }

  //return auth status
  getIsAuth() {
    return this.isAuthenticated;
  }

  //get the auth status liste
  getAuthStatusLisenter() {
    return this.authStatusListener.asObservable(); //we only want to emit from this component
  }

  //send a request to create a new user
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log("Auth Service Create User::");
        console.log(response);
      });
  }

  //login user
  loginUser(email: string, password:string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        console.log("Auth Service Login User::");
        console.log(response);
        //use the token, store it locally
        const token = response.token;
        this.token = token;
        //check for a valid token
        if (token) {
          //get expires in duration
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
              //force logout after duration set time
              this.logoutUser();
          },  (expiresInDuration * 1000)); //set timeout works in milliseconds
          this.isAuthenticated = true;
          this.authStatusListener.next(true); //emit a new value for the other components
          this.router.navigate(['/']); //navigate home
        }
      });
  }

  //lougout user
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); //push new value
    clearTimeout(this.tokenTimer); //clear the timer when we logout
    this.router.navigate(['/']); //navigate home
  }
}
