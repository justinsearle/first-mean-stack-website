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
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true); //emit a new value for the other components
          //save auth data to local storage
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate); //save
          this.router.navigate(['/']); //navigate home
        }
      });
  }

  //attempt to automatically authenticate a user if we have valid local storage data
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    //instead of checking for in future, check for the difference to allow us to set auth timer
    //const isInFuture = (authInformation.expirationDate > now);
    const expiresIn = (authInformation.expirationDate.getTime() - now.getTime());
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  //lougout user
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); //push new value
    clearTimeout(this.tokenTimer); //clear the timer when we logout
    this.clearAuthData(); //clear local storage
    this.router.navigate(['/']); //navigate home
  }

  //a method to set our expiration timer
  private setAuthTimer(duration: number) {
    console.log("Auth Service Set Auth Timer:: " + duration);
    this.tokenTimer = setTimeout(() => {
        //force logout after duration set time
        this.logoutUser();
    },  (duration * 1000)); //set timeout works in milliseconds
  }

  //a method to save a token in browser storage to persist logins
  private saveAuthData(token: string, expiriationDate: Date) {
    //use localstoreage API
    localStorage.setItem('token', token); //store key value pair :)
    localStorage.setItem('expiration', expiriationDate.toISOString());
  }

  //a method to clear the local storage data
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  //a method to retrieve auth data from the local storage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
