import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/auth-models';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/auth/login';
    private http = inject(HttpClient);

    isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl, { email, password });
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
        this.isLoggedIn.set(true); // ← met à jour le signal après login
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
        this.isLoggedIn.set(false); // ← met à jour le signal après logout
    }

    isTokenExpired(token: string): boolean {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    }


}
