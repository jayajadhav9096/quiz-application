import { Routes } from '@angular/router';
import { adminGuard } from '../auth-guard/admin.guard';
import { authGuard } from '../auth-guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [{
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./categories-dropdown/categories-dropdown.component')
                .then(m => m.CategoriesDropdownComponent)
        },
        {
            path: 'view/:id',
            loadComponent: () => import('./view-quiz/view-quiz.component')
                .then(m => m.ViewQuizComponent)
        },
        {
            path: 'quiz-list',
            loadComponent: () => import('./quiz-list/quiz-list.component')
                .then(m => m.QuizListComponent)
        },
        {
            path: 'user-quiz-list',
            loadComponent: () =>
                import('./quiz-list/quiz-list.component')
                    .then((m) => m.QuizListComponent),
            data: { mode: 'admin-view' },
            canActivate: [adminGuard]
        }
    ]
}, {
    path: 'take-quiz',
    loadComponent: () => import('./take-quiz/take-quiz.component')
        .then(m => m.TakeQuizComponent),
    canActivate: [authGuard],
    canDeactivate: [CanDeactivateGuard]
}, {
    path: '**',
    component: PageNotFoundComponent
}
];
