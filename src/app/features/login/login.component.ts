import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  error = '';

  form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
      this.form = this.fb.group({
    username: ['admin', Validators.required],
    password: ['admin123', Validators.required]
  });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.getRawValue();
    this.auth.login(username || '', password || '').subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => {
        this.error = 'Login failed. Please check username and password.';
        this.loading = false;
      }
    });
  }
}
