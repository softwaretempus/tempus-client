import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IUser } from 'src/app/users/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  title: string = 'Detalhes do usuário'
  errorMessage = '';
  user: IUser | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getUser(id);
    }
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      user => this.user = user,
      error => this.errorMessage = <any>error);
  }

  onBack(): void {
    this.router.navigate(['/users'])
  }

}
