import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide: boolean = true;
  validateForm!: FormGroup;

  confirmationValidator = (control: FormControl): { [s: string]: boolean } | null => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return null;
  }

  constructor(private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  public user = {
    userFirstName: '',
    userLastName: '',
    userName: '',
    userPassword: '',
    confirmPassword: ''
  }

  ngOnInit(): void {
  }

  register(registerForm: NgForm) {
    console.log(registerForm.value);

    if (!registerForm.value.userFirstName || !registerForm.value.userLastName || !registerForm.value.userName || !registerForm.value.userPassword) {
      this._snackBar.open("All fields are required.", 'Ok', { duration: 3000 });
      return;
    }

    if (registerForm.value.confirmPassword !== registerForm.value.userPassword) {
      this._snackBar.open("Password and confirm password should be the same", 'Ok', { duration: 3000 });
      return;
    }

    this.userService.register(registerForm.value).subscribe(
      (response) => {
        if (response === null) {
          Swal.fire('Oops....', 'This email is already registered. Please try with another email.', 'error');
        } else {
          Swal.fire({ icon: 'success', title: 'User Registered Successfully' });
          this.router.navigate(['/login']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
