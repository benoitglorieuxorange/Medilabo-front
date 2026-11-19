import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
    selector: 'app-login-component',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login-component.html',
    styleUrls: ['./login-component.css'],
})

export class LoginComponent {

    email: string = '';
    password: string = '';
    errorMessage: string = '';

    private authService = inject(AuthService);
    private router = inject(Router);

    onSubmit(): void {
        this.authService.login(this.email, this.password).subscribe({
            next: (response) => {
                this.authService.saveToken(response.token);
                this.router.navigate(['/cases']);
            },
            error: (error) => {
                console.error('Login error:', error);
                this.errorMessage = 'Invalid email or password';
            }
        });
    }

}
