import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

import { IUser } from '../user/User'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  private user: any = {
    email: 'admin',
    senha: 'admin'
  }
  
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login() {
    this.authService.userAuthentication(this.user)
  }

}
