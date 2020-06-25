import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  //use constructor to inject auth service to show correct links
  constructor(private authService: AuthService) {}

  //we need to subscribe to the Auth value
  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusLisenter()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  //destroy subscription
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  //on logout clears token and inform all interested parts on the page about this change
  onLogout() {
    this.authService.logoutUser();
  }
}
