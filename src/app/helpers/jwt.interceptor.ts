import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { debounceTime, debounce } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../views/login/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        debounceTime(800)
        if(localStorage.getItem('token') != null) {
            let token = localStorage.getItem('token')
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        } else {
            this.router.navigate(['/login'])
        }
        return next.handle(request);
    }
}