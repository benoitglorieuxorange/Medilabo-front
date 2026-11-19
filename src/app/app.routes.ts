import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { authGuard } from './guards/auth-guard';
import { CaseComponent } from './components/case-component/case-component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cases', component: CaseComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
