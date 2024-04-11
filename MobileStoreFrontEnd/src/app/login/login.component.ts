import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserAuthService } from '../services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  login(loginForm: NgForm) {
    if (!loginForm.value.userName || !loginForm.value.userPassword) {
      this._snackBar.open("Both email and password are required.", 'Ok', { duration: 3000 });
      return;
    }

    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        const role = response.user.role[0].roleName;

        const successMessage = role === 'Admin' ? 'Admin Login Successful' : 'User Login Successful';

        Swal.fire({
          title: successMessage,
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        this.router.navigate(['']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid username or password. Try Again!'
        });
        console.log(error);
      }
    );
  }

  registerUser() {
    this.router.navigate(['/register']);
  }
}
